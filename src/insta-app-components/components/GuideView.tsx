import { useState } from "react";

// ── 인스타 UI 공통 스타일 ──────────────────────────────────────
const ig: Record<string, React.CSSProperties> = {
  card:      { background:"#fff", border:"1px solid #e8e8e8", borderRadius:14, overflow:"hidden", marginTop:4 },
  header:    { fontSize:13, fontWeight:600, color:"#333", padding:"12px 14px 10px", borderBottom:"1px solid #f0f0f0" },
  subtext:   { fontSize:11, color:"#aaa", padding:"6px 14px 8px", borderBottom:"1px solid #f5f5f5" },
  row:       { display:"flex", alignItems:"center", gap:10, padding:"11px 14px", borderBottom:"1px solid #f5f5f5" },
  rowActive: { display:"flex", alignItems:"center", gap:10, padding:"11px 14px", borderBottom:"1px solid #f0f0ff", background:"#f0f4ff", border:"1.5px solid #4f46e5", borderRadius:8, margin:"4px 8px" },
  rowIcon:   { width:28, height:28, borderRadius:"50%", background:"#f0f0f0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, flexShrink:0 },
  rowIconAct:{ width:28, height:28, borderRadius:"50%", background:"#e0e4ff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, flexShrink:0 },
  rowText:   { fontSize:13, color:"#bbb" },
  rowTextAct:{ fontSize:13, color:"#111", fontWeight:700 },
  rowSub:    { fontSize:11, color:"#bbb" },
  rowSubAct: { fontSize:11, color:"#4f46e5" },
  chevron:   { marginLeft:"auto", color:"#ccc", fontSize:16 },
  chevronAct:{ marginLeft:"auto", color:"#4f46e5", fontSize:16 },
  blueBtn:   { margin:"12px 14px 14px", padding:"12px 0", background:"#4f46e5", color:"#fff", borderRadius:10, textAlign:"center", fontWeight:700, fontSize:14 },
};

// ── 각 스텝 일러스트 ───────────────────────────────────────────

// STEP 01 — 계정 센터
const Illust01 = () => (
  <div style={ig.card}>
    <div style={ig.header}>{"< 설정 및 활동"}</div>
    <div style={{ ...ig.row, padding:"8px 14px" }}>
      <div style={{ width:"100%", background:"#f5f5f5", borderRadius:6, padding:"7px 10px", fontSize:12, color:"#bbb" }}>🔍 검색</div>
    </div>
    <div style={{ fontSize:11, fontWeight:600, color:"#888", padding:"6px 14px 4px" }}>내 계정</div>
    <div style={ig.rowActive}>
      <div style={ig.rowIconAct}>👤</div>
      <div>
        <div style={ig.rowTextAct}>계정 센터</div>
        <div style={ig.rowSubAct}>비밀번호 · 보안 · 개인정보</div>
      </div>
      <div style={ig.chevronAct}>›</div>
    </div>
    <div style={{ fontSize:11, fontWeight:600, color:"#888", padding:"8px 14px 4px" }}>내 Instagram 사용 방식</div>
    {["저장됨","보관"].map(t => (
      <div key={t} style={{ ...ig.row, padding:"9px 14px" }}>
        <div style={ig.rowIcon}>□</div>
        <div style={ig.rowText}>{t}</div>
      </div>
    ))}
  </div>
);

// STEP 02 — 내 정보 및 권한
const Illust02 = () => (
  <div style={ig.card}>
    <div style={ig.header}>{"< 계정 센터"}</div>
    {[
      ["👤","프로필 및 개인정보","프로필 1개",false],
      ["🔒","비밀번호 및 보안","",false],
      ["🔗","연결된 환경","",false],
      ["📋","내 정보 및 권한","",true],
      ["📢","광고 기본 설정","",false],
    ].map(([icon,text,sub,active]) => (
      active
        ? <div key={text as string} style={ig.rowActive}>
            <div style={ig.rowIconAct}>{icon}</div>
            <div><div style={ig.rowTextAct}>{text}</div>{sub && <div style={ig.rowSubAct}>{sub as string}</div>}</div>
            <div style={ig.chevronAct}>›</div>
          </div>
        : <div key={text as string} style={ig.row}>
            <div style={ig.rowIcon}>{icon}</div>
            <div><div style={ig.rowText}>{text as string}</div>{sub && <div style={ig.rowSub}>{sub as string}</div>}</div>
            <div style={ig.chevron}>›</div>
          </div>
    ))}
  </div>
);

// STEP 03 — 내 정보 내보내기
const Illust03 = () => (
  <div style={ig.card}>
    <div style={ig.header}>{"< 내 정보 및 권한"}</div>
    <div style={ig.subtext}>정보 사본을 다운로드하려면 아래로 이동하세요</div>
    {[
      ["⬇️","내 정보 가져오기",false],
      ["📄","내 정보 내보내기",true],
      ["↗️","정보 이전",false],
    ].map(([icon,text,active]) => (
      active
        ? <div key={text as string} style={ig.rowActive}>
            <div style={ig.rowIconAct}>{icon}</div>
            <div style={ig.rowTextAct}>{text}</div>
            <div style={ig.chevronAct}>›</div>
          </div>
        : <div key={text as string} style={ig.row}>
            <div style={ig.rowIcon}>{icon}</div>
            <div style={ig.rowText}>{text as string}</div>
            <div style={ig.chevron}>›</div>
          </div>
    ))}
  </div>
);

// STEP 04 — 내보내기 만들기
const Illust04 = () => (
  <div style={ig.card}>
    <div style={ig.header}>{"< 내 정보 내보내기"}</div>
    <div style={ig.subtext}>정보 사본을 기기에 내보낼 수 있어요</div>
    <div style={ig.blueBtn}>내보내기 만들기</div>
  </div>
);

// STEP 05 — 계정 선택
const Illust05 = () => (
  <div style={ig.card}>
    <div style={ig.header}>{"< 프로필 선택"}</div>
    <div style={ig.subtext}>정보를 내보낼 프로필을 선택하세요</div>
    <div style={ig.rowActive}>
      <div style={ig.rowIconAct}>👤</div>
      <div>
        <div style={ig.rowTextAct}>내 인스타그램 계정</div>
        <div style={ig.rowSubAct}>Instagram</div>
      </div>
      <div style={ig.chevronAct}>›</div>
    </div>
    <div style={ig.row}>
      <div style={ig.rowIcon}>🧵</div>
      <div>
        <div style={ig.rowText}>연결된 쓰레드 계정</div>
        <div style={ig.rowSub}>Threads</div>
      </div>
      <div style={ig.chevron}>›</div>
    </div>
  </div>
);

// STEP 06 — 기기로 내보내기
const Illust06 = () => (
  <div style={ig.card}>
    <div style={ig.header}>{"< 내보낼 위치 선택"}</div>
    <div style={ig.subtext}>정보를 기기나 외부 서비스로 내보낼 수 있어요</div>
    <div style={ig.rowActive}>
      <div style={ig.rowIconAct}>📱</div>
      <div>
        <div style={ig.rowTextAct}>기기로 내보내기</div>
        <div style={ig.rowSubAct}>파일을 직접 내려받아요</div>
      </div>
      <div style={ig.chevronAct}>›</div>
    </div>
    <div style={ig.row}>
      <div style={ig.rowIcon}>☁️</div>
      <div style={ig.rowText}>외부 서비스로 내보내기</div>
      <div style={ig.chevron}>›</div>
    </div>
  </div>
);

// STEP 07 — 설정 3개 변경
const Illust07 = () => (
  <div style={ig.card}>
    <div style={ig.header}>{"< 내보내기 설정"}</div>
    <div style={ig.subtext}>준비되면 인스타그램이 이메일로 알려줘요</div>
    {/* 3개 설정 행 — 모두 강조 */}
    <div style={{ ...ig.rowActive, flexDirection:"column", alignItems:"flex-start", gap:4, margin:"6px 8px 2px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, width:"100%" }}>
        <div style={ig.rowIconAct}>🖼️</div>
        <div style={{ flex:1 }}>
          <div style={ig.rowTextAct}>정보 맞춤 설정</div>
          <div style={ig.rowSubAct}>동영상 · 메시지 이 두 개만 끄기</div>
        </div>
        <div style={ig.chevronAct}>›</div>
      </div>
    </div>
    <div style={{ ...ig.rowActive, flexDirection:"column", alignItems:"flex-start", gap:4, margin:"2px 8px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, width:"100%" }}>
        <div style={ig.rowIconAct}>📅</div>
        <div style={{ flex:1 }}>
          <div style={ig.rowTextAct}>기간</div>
          <div style={ig.rowSubAct}>작년 → 전체 기간</div>
        </div>
        <div style={ig.chevronAct}>›</div>
      </div>
    </div>
    <div style={{ ...ig.rowActive, flexDirection:"column", alignItems:"flex-start", gap:4, margin:"2px 8px 6px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, width:"100%" }}>
        <div style={ig.rowIconAct}>{"</>"}</div>
        <div style={{ flex:1 }}>
          <div style={ig.rowTextAct}>형식</div>
          <div style={{ fontSize:11, color:"#4f46e5" }}>HTML → <span style={{ color:"#ef4444", fontWeight:800 }}>JSON ★</span></div>
        </div>
        <div style={ig.chevronAct}>›</div>
      </div>
    </div>
    <div style={ig.blueBtn}>내보내기 시작</div>
  </div>
);

// ── 가이드 스텝 데이터 ────────────────────────────────────────
const GUIDE_STEPS = [
  {
    step:"STEP 01",
    title:"계정 센터로 들어가기",
    desc:"프로필 오른쪽 위 ≡ 를 누르면 이 화면이 나와요.",
    caption:"계정 센터를 눌러요",
    Illust: Illust01,
  },
  {
    step:"STEP 02",
    title:"내 정보 및 권한 열기",
    desc:"목록 아래쪽에 있어요. 위 세 개는 지나치면 됩니다.",
    caption:"내 정보 및 권한을 눌러요",
    Illust: Illust02,
  },
  {
    step:"STEP 03",
    title:"내 정보 내보내기 열기",
    desc:"가져오기가 아니라 내보내기예요. 바로 위에 붙어 있어 헷갈리기 쉬워요.",
    caption:"내 정보 내보내기를 눌러요",
    Illust: Illust03,
  },
  {
    step:"STEP 04",
    title:"내보내기 만들기",
    desc:"전에 만든 내역이 있으면 버튼 아래에 함께 보여요.",
    caption:"파란 내보내기 만들기 버튼을 눌러요",
    Illust: Illust04,
  },
  {
    step:"STEP 05",
    title:"내 인스타그램 계정 고르기",
    desc:"인스타그램을 선택하세요. 쓰레드를 고르면 팔로워 파일이 안 들어와요.",
    caption:"인스타그램 계정을 골라요",
    Illust: Illust05,
  },
  {
    step:"STEP 06",
    title:"기기로 내보내기",
    desc:"파일이 내 기기에만 저장돼요. 외부 서비스로 보내면 앱에서 못 씁니다.",
    caption:"기기로 내보내기를 골라요",
    Illust: Illust06,
  },
  {
    step:"STEP 07",
    title:"설정 3개 바꾸고 내보내기 시작 누르기",
    desc:"정보는 동영상·메시지 두 개만 끄고, 기간은 전체 기간으로 반드시 설정해 주세요. 형식은 JSON이어야 다양한 결과를 받아볼 수 있어요.",
    caption:"설정 3개 바꾸고 내보내기 시작!",
    Illust: Illust07,
  },
];

// ── GuideView 컴포넌트 ────────────────────────────────────────
interface GuideViewProps {
  onClose: () => void;
}

export default function GuideView({ onClose }: GuideViewProps) {
  const [current, setCurrent] = useState(0);
  const total   = GUIDE_STEPS.length;
  const step    = GUIDE_STEPS[current];
  const Illust  = step.Illust;
  const progress = ((current + 1) / total) * 100;

  return (
    <div style={gs.overlay}>
      {/* 헤더 */}
      <div style={gs.header}>
        <button style={gs.backBtn} onClick={onClose}>←</button>
        <span style={gs.headerTitle}>언팔 수사대</span>
        <span style={{ fontSize:18 }}>⚙️</span>
      </div>

      {/* 프로그레스 */}
      <div style={gs.progressWrap}>
        <div style={gs.progressBg}>
          <div style={{ ...gs.progressFill, width:`${progress}%` }}/>
        </div>
        <span style={gs.progressText}>{current+1}/{total}</span>
      </div>

      {/* 본문 */}
      <div style={gs.body}>
        <div style={gs.stepLabel}>{step.step}</div>
        <h2 style={gs.title}>{step.title}</h2>
        <p style={gs.desc}>{step.desc}</p>
        <Illust />
        <p style={gs.caption}>{step.caption}</p>
      </div>

      {/* 버튼 */}
      <div style={gs.btnRow}>
        <button
          style={{ ...gs.prevBtn, opacity: current===0 ? 0.4:1 }}
          disabled={current===0}
          onClick={() => setCurrent(c => c-1)}
        >
          이전
        </button>
        <button
          style={gs.nextBtn}
          onClick={() => { if(current===total-1) onClose(); else setCurrent(c => c+1); }}
        >
          {current===total-1 ? "수사 시작하기" : "다음"}
        </button>
      </div>
    </div>
  );
}

// ── 스타일 ────────────────────────────────────────────────────
const gs: Record<string, React.CSSProperties> = {
  overlay:      { position:"absolute", inset:0, background:"#f4f5f8", display:"flex", flexDirection:"column", zIndex:100, borderRadius:32, overflow:"hidden" },
  header:       { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 20px 12px", background:"#1b2338", borderBottom:"3px solid #f0b429" },
  backBtn:      { background:"none", border:"none", fontSize:20, cursor:"pointer", color:"#fff", padding:0 },
  headerTitle:  { fontSize:16, fontWeight:800, color:"#fff" },
  progressWrap: { display:"flex", alignItems:"center", gap:10, padding:"12px 20px 0", background:"#fff" },
  progressBg:   { flex:1, height:5, background:"#f0f0f0", borderRadius:99, overflow:"hidden" },
  progressFill: { height:"100%", background:"#f0b429", borderRadius:99, transition:"width 0.35s ease" },
  progressText: { fontSize:12, color:"#6b7280", fontWeight:600, flexShrink:0 },
  body:         { flex:1, overflowY:"auto", padding:"16px 18px 8px", background:"#fff" },
  stepLabel:    { fontSize:11, fontWeight:800, color:"#f0b429", letterSpacing:"0.1em", marginBottom:6 },
  title:        { fontSize:20, fontWeight:900, color:"#111827", margin:"0 0 6px", lineHeight:1.4 },
  desc:         { fontSize:13.5, color:"#6b7280", margin:"0 0 14px", lineHeight:1.6 },
  caption:      { textAlign:"center", fontSize:13, color:"#4f46e5", fontWeight:700, marginTop:10 },
  btnRow:       { display:"flex", gap:10, padding:"12px 18px 20px", background:"#fff", borderTop:"1px solid #f0f0f0" },
  prevBtn:      { flex:1, padding:"13px 0", border:"1.5px solid #d1d5db", background:"#fff", color:"#374151", fontSize:14, fontWeight:700, borderRadius:14, cursor:"pointer", fontFamily:"inherit" },
  nextBtn:      { flex:2.5, padding:"13px 0", background:"#1b2338", color:"#f0b429", fontSize:14, fontWeight:800, borderRadius:14, border:"none", cursor:"pointer", fontFamily:"inherit" },
};
