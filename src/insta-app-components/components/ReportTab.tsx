import { AnalysisResult } from "./types";
import Empty from "./Empty";

interface ReportTabProps {
  result: AnalysisResult | null;
}

export default function ReportTab({ result }: ReportTabProps) {
  if (!result) return <Empty />;

  const ratio = result.following > 0
    ? ((result.mutual.length / result.following) * 100).toFixed(1)
    : "0.0";

  const rows = [
    { label: "전체 팔로잉", value: result.following,          color: "#222"    },
    { label: "전체 팔로워", value: result.followers,          color: "#222"    },
    { label: "맞팔 수",     value: result.mutual.length,      color: "#0064FF" },
    { label: "언팔 수",     value: result.unfollowers.length, color: "#f43f5e" },
  ];

  return (
    <div style={{ padding:"18px" }}>
      <div style={{ fontSize:17, fontWeight:800, marginBottom:14 }}>📊 분석 리포트</div>

      {/* 수치 카드 */}
      <div style={{ background:"#fafbff", border:"1px solid #e8eeff", borderRadius:16, overflow:"hidden", marginBottom:14 }}>
        {rows.map(({ label, value, color }) => (
          <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"12px 16px", borderBottom:"1px solid #f0f4ff" }}>
            <span style={{ fontSize:14, color:"#555" }}>{label}</span>
            <span style={{ fontSize:16, fontWeight:700, color }}>{value}</span>
          </div>
        ))}
      </div>

      {/* 맞팔 비율 바 */}
      <div style={{ background:"#f6f8ff", borderRadius:14, padding:"14px 16px" }}>
        <div style={{ fontSize:13, color:"#888", marginBottom:8 }}>맞팔 비율</div>
        <div style={{ height:10, background:"#e0eaff", borderRadius:99, overflow:"hidden" }}>
          <div style={{
            height:"100%",
            width:`${Math.min(Number(ratio), 100)}%`,
            background:"linear-gradient(90deg,#0064FF,#338bff)",
            borderRadius:99,
            transition:"width 0.6s ease",
          }} />
        </div>
        <div style={{ fontSize:13, fontWeight:700, color:"#0064FF", marginTop:6, textAlign:"right" }}>{ratio}%</div>
      </div>
    </div>
  );
}
