// src/components/RefundView.tsx

interface RefundViewProps {
  onClose: () => void;
}

export default function RefundView({ onClose }: RefundViewProps) {
  const sections = [
    {
      title: "제1조 (구독 서비스 결제)",
      content:
        "인스타 언팔 수사대 PRO 구독은 월 1,100원으로 제공됩니다. 결제는 애플 앱스토어 또는 구글 플레이스토어를 통해 진행되며, 구독 시작일로부터 매월 자동으로 갱신됩니다.",
    },
    {
      title: "제2조 (구독 해지)",
      content:
        "구독은 언제든지 해지할 수 있습니다. 해지는 각 앱스토어의 구독 관리 메뉴에서 진행하며, 다음 갱신일 24시간 전까지 해지해야 다음 달 요금이 청구되지 않습니다.\n\n• 애플 앱스토어: 설정 > Apple ID > 구독\n• 구글 플레이스토어: Play 스토어 > 프로필 > 결제 및 구독",
    },
    {
      title: "제3조 (환불 정책)",
      content:
        "구독 서비스의 환불은 각 앱스토어의 환불 정책에 따릅니다. 회사를 통한 직접 환불은 불가하며, 아래 경로를 통해 환불을 요청하세요.\n\n• 애플 앱스토어: reportaproblem.apple.com\n• 구글 플레이스토어: 구글 플레이 고객센터",
    },
    {
      title: "제4조 (청약철회)",
      content:
        "디지털 콘텐츠 서비스의 특성상, 서비스 이용이 시작된 경우 전자상거래법 제17조 제2항에 따라 청약철회가 제한될 수 있습니다. 단, 서비스 이용 전 또는 서비스에 중대한 하자가 있는 경우에는 청약철회가 가능합니다.",
    },
    {
      title: "제5조 (결제 오류 처리)",
      content:
        "결제 오류 또는 이중 청구가 발생한 경우, jihunj624@gmail.com으로 문의해주세요. 확인 후 영업일 기준 5일 이내에 처리해드립니다.",
    },
    {
      title: "제6조 (서비스 중단 시 환불)",
      content:
        "회사의 사정으로 서비스가 중단되는 경우, 미사용 기간에 해당하는 구독료를 일할 계산하여 환불해드립니다.",
    },
  ];

  return (
    <div style={s.overlay}>
      <div style={s.header}>
        <button style={s.backBtn} onClick={onClose}>←</button>
        <div style={s.headerCenter}>
          <span style={s.headerTitle}>결제·환불 및 청약철회 정책</span>
        </div>
        <div style={{ width: 32 }} />
      </div>

      <div style={s.effectiveDate}>시행일: 2026년 8월 14일</div>

      {/* 요약 배지 */}
      <div style={s.summaryBox}>
        <div style={s.summaryIcon}>💳</div>
        <div>
          <div style={s.summaryTitle}>월 1,100원 · 언제든 해지 가능</div>
          <div style={s.summaryDesc}>
            환불은 앱스토어를 통해 진행돼요.<br />
            회사를 통한 직접 환불은 불가해요.
          </div>
        </div>
      </div>

      <div style={s.body}>
        {sections.map((sec, i) => (
          <div key={i} style={s.section}>
            <div style={s.sectionTitle}>{sec.title}</div>
            <div style={s.sectionContent}>
              {sec.content.split("\n").map((line, j) => (
                <span key={j}>{line}{j < sec.content.split("\n").length - 1 && <br />}</span>
              ))}
            </div>
          </div>
        ))}

        <div style={s.contactBox}>
          <div style={s.contactTitle}>결제 문의</div>
          <div style={s.contactText}>jihunj624@gmail.com</div>
        </div>

        <div style={{ height: 32 }} />
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  overlay: {
    position: "absolute", inset: 0, background: "#f4f5f8",
    display: "flex", flexDirection: "column",
    zIndex: 300, borderRadius: 32, overflow: "hidden",
  },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "16px 20px 14px", background: "#1b2338",
    borderBottom: "3px solid #f0b429",
  },
  backBtn: { background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#fff", padding: 0 },
  headerCenter: { display: "flex", flexDirection: "column", alignItems: "center" },
  headerTitle: { fontSize: 15, fontWeight: 800, color: "#fff" },
  effectiveDate: { fontSize: 12, color: "#9ca3af", padding: "10px 20px", background: "#fff", borderBottom: "1px solid #f3f4f6" },
  summaryBox: { display: "flex", alignItems: "center", gap: 14, background: "#fef9e7", borderBottom: "1px solid #fde68a", padding: "14px 20px" },
  summaryIcon: { fontSize: 28, flexShrink: 0 },
  summaryTitle: { fontSize: 14, fontWeight: 800, color: "#1b2338", marginBottom: 4 },
  summaryDesc: { fontSize: 12.5, color: "#6b7280", lineHeight: 1.55 },
  body: { flex: 1, overflowY: "auto", padding: "16px 16px 0" },
  section: { background: "#fff", borderRadius: 14, padding: "16px 18px", marginBottom: 8 },
  sectionTitle: { fontSize: 14, fontWeight: 800, color: "#1b2338", marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid #f3f4f6" },
  sectionContent: { fontSize: 13.5, color: "#374151", lineHeight: 1.7 },
  contactBox: { background: "#1b2338", borderRadius: 14, padding: "16px 18px", marginBottom: 8 },
  contactTitle: { fontSize: 12, fontWeight: 700, color: "#f0b429", letterSpacing: "0.08em", marginBottom: 6 },
  contactText: { fontSize: 14, color: "#fff" },
};
