import { HistoryEntry } from "./types";
import Empty from "./Empty";

interface HistoryTabProps {
  history: HistoryEntry[];
}

export default function HistoryTab({ history }: HistoryTabProps) {
  if (history.length === 0) return <Empty text="아직 분석 기록이 없어요." />;

  return (
    <div style={{ padding:"18px" }}>
      <div style={{ fontSize:17, fontWeight:800, marginBottom:14 }}>📋 분석 기록</div>
      {history.map((h, i) => (
        <div key={i} style={{ background:"#fafbff", border:"1px solid #e8eeff", borderRadius:14, padding:"13px 16px", marginBottom:10 }}>
          <div style={{ fontSize:13, color:"#888", marginBottom:6 }}>{h.date}</div>
          <div style={{ display:"flex", gap:14, fontSize:14, fontWeight:600, color:"#333" }}>
            <span>팔로워 {h.followers}</span>
            <span>팔로잉 {h.following}</span>
            <span style={{ color:"#f43f5e", fontWeight:700 }}>언팔 {h.unfollowers}명</span>
          </div>
        </div>
      ))}
    </div>
  );
}
