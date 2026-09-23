import { useRef, useState, useEffect } from "react";
import JSZip from "jszip";
import { requestReview } from "@apps-in-toss/web-framework";
import { AnalysisResult, HistoryEntry } from "./types";
import LockScreen from "./LockScreen";

const API_BASE = "https://unfallow.onrender.com";

// ✅ 유저 행동 로그 서버에 저장
async function logUserAction(userId: string, action: string) {
  if (!userId) return;
  try {
    await fetch(`${API_BASE}/api/unfollow/analysis-log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, type: action }),
    });
  } catch (e) {
    console.warn("[로그] 저장 실패:", e);
  }
}

async function checkPremium(userId: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${API_BASE}/api/unfollow/premium-status/${userId}`,
      { signal: AbortSignal.timeout(10000) }
    );
    const data = await res.json();
    return data.isPremium === true;
  } catch {
    return false;
  }
}

// ── 아이콘 ────────────────────────────────────────────────────
const IconShield = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M12 3L4 7v5c0 4.4 3.4 8.5 8 9.5 4.6-1 8-5.1 8-9.5V7L12 3z" stroke="#f0b429" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M9 12l2 2 4-4" stroke="#f0b429" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconEye = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <ellipse cx="12" cy="12" rx="9" ry="5.5" stroke="#f0b429" strokeWidth="1.8"/>
    <circle cx="12" cy="12" r="2.5" fill="#f0b429"/>
  </svg>
);
const IconChart = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M4 18l5-6 4 3 5-7" stroke="#f0b429" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconFolder = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" stroke="#f0b429" strokeWidth="1.8"/>
  </svg>
);

// ── ZIP 파서 ──────────────────────────────────────────────────
async function extractFromZip(zipFile: File): Promise<{ follower: string; following: string }> {
  const zip = await JSZip.loadAsync(zipFile);
  let followerJson  = "";
  let followingJson = "";
  for (const [filePath, file] of Object.entries(zip.files)) {
    if (file.dir) continue;
    const filename = (filePath.split("/").pop() ?? "").toLowerCase();
    if (!filename.endsWith(".json")) continue;
    if (filename.startsWith("follower"))  followerJson  = await file.async("text");
    if (filename.startsWith("following")) followingJson = await file.async("text");
  }
  if (!followerJson || !followingJson) {
    const found = Object.keys(zip.files)
      .filter(p => !zip.files[p].dir && p.endsWith(".json"))
      .map(p => p.split("/").pop())
      .join(", ");
    throw new Error("ZIP 안에서 팔로워/팔로잉 파일을 찾지 못했어요.\n찾은 JSON 파일: " + (found || "없음"));
  }
  return { follower: followerJson, following: followingJson };
}

// ── JSON 파서 ─────────────────────────────────────────────────
function extractUsernames(json: string): Set<string> {
  const d: any = JSON.parse(json);
  const results: string[] = [];
  if (!Array.isArray(d) && Array.isArray(d.string_list_data)) {
    for (const item of d.string_list_data) {
      const v = item?.value;
      if (v && typeof v === "string" && !v.startsWith("http")) results.push(v.toLowerCase());
    }
    if (results.length > 0) return new Set(results);
  }
  if (!Array.isArray(d) && (d.relationships_following || d.relationships_followers)) {
    const arr = d.relationships_following ?? d.relationships_followers ?? [];
    for (const item of arr) {
      const fromSld = item?.string_list_data?.[0]?.value;
      const v = fromSld ?? item?.value ?? item?.title;
      if (v && typeof v === "string") results.push(String(v).toLowerCase());
    }
    if (results.length > 0) return new Set(results);
  }
  if (Array.isArray(d) && d[0]?.string_list_data) {
    for (const item of d) {
      const v = item?.string_list_data?.[0]?.value;
      if (v) results.push(v.toLowerCase());
    }
    if (results.length > 0) return new Set(results);
  }
  if (Array.isArray(d) && d[0]?.title !== undefined) {
    for (const item of d) { if (item?.title) results.push(String(item.title).toLowerCase()); }
    if (results.length > 0) return new Set(results);
  }
  if (Array.isArray(d) && d[0]?.username !== undefined) {
    for (const item of d) { if (item?.username) results.push(String(item.username).toLowerCase()); }
    if (results.length > 0) return new Set(results);
  }
  return new Set(results);
}

export function parseInstagramData(fwr: string, fwing: string): AnalysisResult {
  try {
    const fwrSet   = extractUsernames(fwr);
    const fwingSet = extractUsernames(fwing);
    if (fwrSet.size === 0 && fwingSet.size === 0) {
      const preview = (json: string) => {
        try {
          const parsed = JSON.parse(json);
          if (Array.isArray(parsed)) {
            const first = parsed[0];
            return `Array(${parsed.length}) → 첫번째 키: [${Object.keys(first ?? {}).join(", ")}]`;
          } else {
            return `Object → 키: [${Object.keys(parsed).join(", ")}]`;
          }
        } catch { return json.slice(0, 100); }
      };
      return {
        followers: 0, following: 0, unfollowers: [], mutual: [],
        error: "JSON 형식을 인식하지 못했어요.\n팔로워 파일 구조: " + preview(fwr) + "\n팔로잉 파일 구조: " + preview(fwing),
      };
    }
    const unfollowers = [...fwingSet].filter(u => !fwrSet.has(u));
    const mutual      = [...fwingSet].filter(u => fwrSet.has(u));
    return { followers: fwrSet.size, following: fwingSet.size, unfollowers, mutual, error: null };
  } catch (e) {
    return { followers:0, following:0, unfollowers:[], mutual:[], error:"파일 처리 중 오류: " + String(e) };
  }
}

// ── HomeTab Props ─────────────────────────────────────────────
interface HomeTabProps {
  userId:        string;
  onShowGuide:   () => void;
  onResultReady: (result: AnalysisResult, entry: HistoryEntry) => void;
  result:        AnalysisResult | null;
  onReset:       () => void;
}

// ── HomeTab ───────────────────────────────────────────────────
export default function HomeTab({ userId, onShowGuide, onResultReady, result, onReset }: HomeTabProps) {
  const [step,          setStep]          = useState<"landing"|"uploading"|"locked"|"result">("landing");
  const [pendingResult, setPendingResult] = useState<AnalysisResult | null>(null);
  const [error,         setError]         = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // ✅ result prop이 null이 되면 step도 초기화
  useEffect(() => {
    if (!result) setStep("landing");
  }, [result]);

  // ✅ 결과 화면 진입 시 3초 후 리뷰 팝업
  useEffect(() => {
    if (step !== "result") return;
    const timer = setTimeout(async () => {
      try {
        await requestReview();
      } catch (e) {
        console.warn("[리뷰] 요청 실패:", e);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [step]);

  // ── ZIP 파일 처리 ──────────────────────────────────────────
  const handleZip = async (zipFile: File) => {
    setError("");
    setStep("uploading");
    logUserAction(userId, "file_upload");
    try {
      const { follower, following } = await extractFromZip(zipFile);
      const res = parseInstagramData(follower, following);
      if (res.error) {
        setError(res.error);
        setStep("landing");
        logUserAction(userId, "analysis_error");
        return;
      }
      setPendingResult(res);
      logUserAction(userId, "analysis_complete");

      const isPremium = await checkPremium(userId);
      setError(`DEBUG: userId=${userId?.slice(0,10)} isPremium=${isPremium}`);
      if (isPremium) {
        logUserAction(userId, "result_direct");
        onResultReady(res, {
          date: new Date().toLocaleDateString("ko-KR"),
          unfollowers: res.unfollowers.length,
          followers:   res.followers,
          following:   res.following,
        });
        setStep("result");
      } else {
        logUserAction(userId, "lockscreen_view");
        setStep("locked");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "파일 처리 중 오류가 발생했어요.");
      setStep("landing");
      logUserAction(userId, "analysis_error");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleZip(file);
    e.target.value = "";
  };

  const handleReset = () => {
    logUserAction(userId, "reset");
    setStep("landing");
    setError("");
    setPendingResult(null);
    onReset();
  };

  const handleUnlock = () => {
    if (!pendingResult) return;
    logUserAction(userId, "ad_unlock");
    onResultReady(pendingResult, {
      date: new Date().toLocaleDateString("ko-KR"),
      unfollowers: pendingResult.unfollowers.length,
      followers:   pendingResult.followers,
      following:   pendingResult.following,
    });
    setStep("result");
  };

  // ── 잠금 화면 ─────────────────────────────────────────────
  if (step === "locked" && pendingResult) {
    return (
      <LockScreen
        result={pendingResult}
        userId={userId}
        onWatchAd={handleUnlock}
        onSubscribe={handleUnlock}
        onDismiss={() => {
          logUserAction(userId, "lockscreen_dismiss");
          handleReset();
        }}
      />
    );
  }

  // ── 로딩 화면 ─────────────────────────────────────────────
  if (step === "uploading") {
    return (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:420, gap:20 }}>
        <div style={s.spinner} />
        <div style={{ fontSize:15, color:"#1b2338", fontWeight:700 }}>🔍 용의자 추적 중...</div>
        <div style={{ fontSize:12, color:"#6b7280" }}>ZIP 파일을 분석하고 있어요</div>
      </div>
    );
  }

  // ── 결과 화면 ─────────────────────────────────────────────
  if (step === "result" && result) {
    return (
      <div style={{ padding:"18px 16px 16px" }}>
        <div style={s.resultHero}>
          <div style={s.caseTag}>📁 수사 결과 보고서</div>
          <div style={s.resultBig}>{result.unfollowers.length}</div>
          <div style={s.resultLabel}>명의 용의자를 검거했어요</div>
        </div>
        <div style={{ display:"flex", gap:8, marginBottom:14 }}>
          {([
            ["내 팔로워", result.followers,         "#1b2338"],
            ["팔로잉",    result.following,          "#1b2338"],
            ["맞팔",      result.mutual.length,      "#22c55e"],
            ["언팔",      result.unfollowers.length, "#ef4444"],
          ] as [string,number,string][]).map(([l,v,c]) => (
            <div key={l} style={s.statCard}>
              <div style={{ fontSize:18, fontWeight:900, color:c }}>{v}</div>
              <div style={{ fontSize:11, color:"#6b7280", marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={s.tipCard}>🎯 <strong>용의자 탭</strong>에서 언팔 계정을 확인하고 정리해보세요.</div>
        <button style={s.resetBtn} onClick={handleReset}>새 수사 시작하기</button>
      </div>
    );
  }

  // ── 랜딩 화면 ─────────────────────────────────────────────
  const features = [
    [<IconShield/>, "수사 기밀 보장",          "로그인 없이 기기 안에서만 분석해요"],
    [<IconEye/>,    "신분 위장도 꿰뚫어요",    "아이디 변경까지 추적해드려요"],
    [<IconChart/>,  "증거는 쌓일수록 확실해요", "지난 회차와 자동으로 비교해요"],
    [<IconFolder/>, "오래된 파일도 살려냅니다", "옛날 ZIP을 올려도 복원돼요"],
  ] as [React.ReactNode, string, string][];

  return (
    <div style={{ padding:"22px 16px 16px" }}>
      <div style={s.eyebrow}>🔍 수사 개시</div>
      <h1 style={s.h1}>
        나를 언팔한 용의자,<br/>
        <span style={{ color:"#f0b429" }}>신분 위장해도</span><br/>
        검거해드려요
      </h1>
      <p style={s.sub}>로그인 없이, 인스타에서 직접 받은 파일만으로 수사해요.</p>

      {features.map(([icon, title, desc], i) => (
        <div key={i} style={s.featureCard}>
          <div style={s.featureIcon}>{icon}</div>
          <div>
            <div style={s.featureTitle}>{title}</div>
            <div style={s.featureDesc}>{desc}</div>
          </div>
        </div>
      ))}

      {error && <div style={s.errBox}>⚠️ {error}</div>}

      <div style={{ display:"flex", gap:10, marginTop:4 }}>
        <button
          style={s.guideBtn}
          onClick={() => {
            logUserAction(userId, "guide_click");
            onShowGuide();
          }}
        >
          📖 가이드 보기
        </button>
        <button
          style={s.uploadBtn}
          onClick={() => {
            logUserAction(userId, "upload_btn_click");
            fileRef.current?.click();
          }}
        >
          📤 파일 업로드
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept=".zip"
        style={{ display:"none" }}
        onChange={handleFileChange}
      />

      <p style={s.hint}>인스타그램에서 받은 ZIP 파일을 그대로 올려주세요</p>
    </div>
  );
}

// ── 스타일 ────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  eyebrow:      { fontSize:11, fontWeight:800, color:"#f0b429", letterSpacing:"0.1em", marginBottom:6 },
  h1:           { fontSize:24, fontWeight:900, lineHeight:1.4, color:"#111827", margin:"0 0 8px" },
  sub:          { fontSize:13.5, color:"#6b7280", marginBottom:20 },
  featureCard:  { display:"flex", alignItems:"center", gap:14, background:"#fff", border:"1px solid #e5e7eb", borderRadius:14, padding:"12px 14px", marginBottom:8, borderLeft:"3px solid #f0b429" },
  featureIcon:  { width:40, height:40, background:"#fef9e7", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
  featureTitle: { fontSize:14, fontWeight:700, color:"#111827", marginBottom:2 },
  featureDesc:  { fontSize:12.5, color:"#6b7280" },
  errBox:       { background:"#fef2f2", border:"1px solid #fca5a5", borderRadius:12, padding:"12px 14px", color:"#991b1b", fontSize:13, marginBottom:12, lineHeight:1.6 },
  guideBtn:     { flex:1, padding:"14px 0", border:"1.5px solid #1b2338", background:"#fff", color:"#1b2338", fontSize:14, fontWeight:700, borderRadius:14, cursor:"pointer" },
  uploadBtn:    { flex:2, padding:"14px 0", background:"#1b2338", color:"#f0b429", fontSize:15, fontWeight:800, borderRadius:14, border:"none", cursor:"pointer" },
  hint:         { textAlign:"center", fontSize:12, color:"#9ca3af", marginTop:10, lineHeight:1.5 },
  spinner:      { width:44, height:44, border:"4px solid #fef9e7", borderTop:"4px solid #f0b429", borderRadius:"50%", animation:"spin 0.8s linear infinite" },
  resultHero:   { background:"#1b2338", borderRadius:20, padding:"24px 20px", textAlign:"center", marginBottom:14 },
  caseTag:      { fontSize:11, fontWeight:700, color:"#f0b429", letterSpacing:"0.08em", marginBottom:10 },
  resultBig:    { fontSize:64, fontWeight:900, lineHeight:1, color:"#fff" },
  resultLabel:  { fontSize:15, fontWeight:600, color:"rgba(255,255,255,0.8)", marginTop:6 },
  statCard:     { flex:1, background:"#fff", borderRadius:12, padding:"12px 4px", textAlign:"center", border:"1px solid #e5e7eb" },
  tipCard:      { background:"#fef9e7", border:"1px solid #fde68a", borderRadius:12, padding:"11px 14px", fontSize:13, color:"#92400e", marginBottom:12 },
  resetBtn:     { width:"100%", padding:"13px 0", border:"1.5px solid #1b2338", background:"#fff", color:"#1b2338", fontSize:14, fontWeight:700, borderRadius:14, cursor:"pointer" },
};
