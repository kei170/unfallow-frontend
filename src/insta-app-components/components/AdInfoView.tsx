// src/components/AdInfoView.tsx

interface AdInfoViewProps {
  onClose: () => void;
}

export default function AdInfoView({ onClose }: AdInfoViewProps) {
  const sections = [
    {
      title: "광고 운영 방식",
      content:
        "인스타 언팔 수사대는 토스 광고 SDK를 통해 광고를 제공합니다. 광고는 아래 형태로 운영됩니다.\n\n• 전면 광고(Interstitial): 수사 결과 확인 전 노출",
    },
    {
      title: "광고 제공 목적",
      content:
        "광고 수익은 서비스의 지속적인 운영과 개선을 위해 사용됩니다. 광고를 통해 기본 기능을 무료로 제공할 수 있습니다.",
    },
    {
      title: "광고 없이 사용하는 방법",
      content:
        "월 1,100원의 PRO 구독을 이용하시면 광고 없이 서비스를 이용할 수 있습니다. 구독은 설정 메뉴에서 가입할 수 있으며, 언제든지 해지 가능합니다.",
    },
    {
      title: "광고 개인정보 처리",
      content:
        "토스 광고 SDK는 토스의 개인정보처리방침에 따라 운영됩니다. 언팔 수사대는 광고 식별자 및 광고 관련 데이터를 직접 수집하거나 처리하지 않습니다.",
    },
    {
      title: "광고 관련 문의",
      content:
        "광고 내용 또는 광고 운영 방식에 대한 문의는 아래 이메일로 접수해 주세요.\n\njihunj624@gmail.com",
    },
  ];

  return (
    <div style={s.overlay}>
      <div style={s.header}>
        <button style={s.backBtn} onClick={onClose}>←</button>
        <div style={s.headerCenter}>
          <span style={s.headerTitle}>광고 안내</span>
        </div>
        <div style={{ width: 32 }} />
      </div>

      <div style={s.effectiveDate}>시행일: 2026년 8월 14일</div>

      {/* 요약 배지 */}
      <div style={s.summaryBox}>
        <div style={s.summaryIcon}>📢</div>
        <div>
          <div style={s.summaryTitle}>토스 광고 SDK 사용</div>
          <div style={s.summaryDesc}>
            PRO 구독 시 광고가 표시되지 않아요.<br />
            광고 데이터는 직접 수집하지 않아요.
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
          <div style={s.contactTitle}>광고 문의</div>
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
  headerTitle: { fontSize: 16, fontWeight: 800, color: "#fff" },
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