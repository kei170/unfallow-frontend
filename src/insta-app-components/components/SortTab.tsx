import { useState } from "react";
import { AnalysisResult } from "./types";
import Empty from "./Empty";

// ── 스크린샷용 샘플 데이터 (가상 아이디) ──────────────────────
// const SAMPLE_UNFOLLOWERS = [
//   "_.journey.kr",
//   "daily_minjun",
//   "seoul.snap_",
//   "hana.moment",
//   "photo.junho_",
//   "soyeon.vlog",
//   "kei_daily_",
// ];

interface SortTabProps {
  result: AnalysisResult | null;
}

export default function SortTab({ result }: SortTabProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"alpha" | "reverse">("alpha");
  const [copied, setCopied] = useState("");

  if (!result) return <Empty />;

  const filtered = [...result.unfollowers]
    .filter(u => u.includes(search.toLowerCase()))
    .sort((a, b) => sortBy === "alpha" ? a.localeCompare(b) : b.localeCompare(a));

  const handleCopy = (u: string) => {
    navigator.clipboard?.writeText(`@${u}`);
    setCopied(u);
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <div style={{ padding:"14px 16px" }}>

      {/* 데모 안내 배너 */}
      {/* {isDemo && (
        <div style={{
          background:"#fef9e7", border:"1px solid #fde68a",
          borderRadius:10, padding:"8px 14px",
          fontSize:12, color:"#92400e", marginBottom:10,
        }}>
          📋 파일 업로드 후 실제 언팔 목록이 표시돼요
        </div>
      )} */}

      {/* 검색 + 정렬 */}
      <div style={{ display:"flex", gap:8, marginBottom:10 }}>
        <div style={{
          flex:1, display:"flex", gap:8, alignItems:"center",
          background:"#fff", borderRadius:12,
          padding:"9px 12px", border:"1px solid #e5e7eb",
        }}>
          <span>🔍</span>
          <input
            style={{ border:"none", background:"transparent", outline:"none", flex:1, fontSize:14, fontFamily:"inherit", color:"#111827" }}
            placeholder="아이디 검색"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {(["alpha", "reverse"] as const).map(s => (
          <button key={s}
            style={{
              padding:"7px 12px", borderRadius:10, border:"none",
              fontSize:12, fontWeight:700, cursor:"pointer",
              fontFamily:"inherit",
              background: sortBy === s ? "#1b2338" : "#f4f5f8",
              color:      sortBy === s ? "#f0b429" : "#6b7280",
            }}
            onClick={() => setSortBy(s)}
          >
            {s === "alpha" ? "가나다" : "역순"}
          </button>
        ))}
      </div>

      {/* 용의자 수 */}
      <div style={{ fontSize:13, color:"#f0b429", fontWeight:800, marginBottom:10 }}>
        🎯 {filtered.length}명
      </div>

      {/* 언팔 목록 */}
      <div style={{ display:"flex", flexDirection:"column", gap:8, maxHeight:500, overflowY:"auto" }}>
        {filtered.map((u, i) => (
          <div key={i} style={{
            display:"flex", alignItems:"center", gap:10,
            padding:"12px 14px",
            background:"#fff",
            borderRadius:14,
            border:"1px solid #e5e7eb",
            borderLeft:"3px solid #f0b429",
          }}>
            {/* 아바타 */}
            <div style={{
              width:36, height:36, borderRadius:"50%",
              background:"#1b2338", color:"#f0b429",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontWeight:900, fontSize:15, flexShrink:0,
            }}>
              {u[0]?.toUpperCase()}
            </div>

            {/* 아이디 */}
            <div style={{
              flex:1, fontSize:14, fontWeight:600, color:"#111827",
              overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
            }}>
              @{u}
            </div>

            {/* 복사 버튼 */}
            <button
              style={{
                padding:"5px 10px", borderRadius:8,
                border:"1px solid #e5e7eb",
                cursor:"pointer", fontSize:12,
                color:      copied === u ? "#1b2338" : "#6b7280",
                fontWeight: 600,
                background: copied === u ? "#fef9e7" : "#f9fafb",
                fontFamily:"inherit",
              }}
              onClick={() => handleCopy(u)}
            >
              📋 {copied === u ? "복사됨" : "복사"}
            </button>

            {/* 열기 버튼 */}
            <a
              href={`https://www.instagram.com/${u}/`}
              target= "_blank"
              rel="noreferrer"
              style={{
                padding:"5px 12px",
                background:"#1b2338", color:"#f0b429",
                borderRadius:8, fontSize:12, fontWeight:800,
                textDecoration:"none",
              }}
            >
              열기
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
