// ── 빈 상태 컴포넌트 ───────────────────────────────────────────

interface EmptyProps {
  text?: string;
}

export default function Empty({ text = "파일을 먼저 업로드해주세요." }: EmptyProps) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", height: 260, gap: 12, color: "#bbb",
    }}>
      <span style={{ fontSize: 40 }}>🔍</span>
      <p style={{ fontSize: 14 }}>{text}</p>
    </div>
  );
}
