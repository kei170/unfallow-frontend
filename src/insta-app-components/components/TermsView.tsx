// src/components/TermsView.tsx

interface TermsViewProps {
  onClose: () => void;
}

export default function TermsView({ onClose }: TermsViewProps) {
  const sections = [
    {
      title: "제1조 (목적)",
      content:
        "이 약관은 ChatJAVIS(이하 '회사')가 제공하는 인스타 언팔 수사대 서비스(이하 '서비스')의 이용 조건 및 절차, 이용자와 회사의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.",
    },
    {
      title: "제2조 (서비스 내용)",
      content:
        "서비스는 이용자가 인스타그램으로부터 직접 내려받은 데이터 파일을 이용자 기기 내에서 분석하여 팔로워·팔로잉 현황을 제공합니다. 회사는 이용자의 파일 및 분석 결과를 서버에 저장하거나 외부로 전송하지 않습니다.",
    },
    {
      title: "제3조 (이용자의 의무)",
      content:
        "이용자는 본인 소유의 인스타그램 계정에서 합법적으로 내려받은 데이터 파일만 업로드해야 합니다. 타인의 데이터를 무단으로 사용하는 행위는 금지됩니다.",
    },
    {
      title: "제4조 (서비스 이용 제한)",
      content:
        "회사는 서비스 운영상 필요한 경우 이용자에 대한 서비스 제공을 일시적으로 제한하거나 중단할 수 있습니다. 이 경우 회사는 사전에 공지하며, 사전 공지가 불가능한 경우 사후에 지체 없이 공지합니다.",
    },
    {
      title: "제5조 (책임 제한)",
      content:
        "서비스는 이용자 기기 내에서만 데이터를 처리하므로, 이용자가 업로드한 파일의 정확성·완전성에 대한 책임은 이용자에게 있습니다. 회사는 분석 결과의 정확성을 보증하지 않으며, 이로 인한 손해에 대해 책임을 지지 않습니다.",
    },
    {
      title: "제6조 (구독 서비스)",
      content:
        "유료 구독 서비스는 월 1,100원으로 자동 갱신됩니다. 구독 해지는 앱스토어 구독 관리에서 다음 갱신일 24시간 전까지 할 수 있으며, 이미 결제된 금액은 환불되지 않습니다.",
    },
    {
      title: "제7조 (약관의 변경)",
      content:
        "회사는 필요한 경우 약관을 변경할 수 있으며, 변경 시 서비스 내 공지를 통해 이용자에게 알립니다. 변경된 약관은 공지 후 7일이 경과한 날부터 효력이 발생합니다.",
    },
    {
      title: "제8조 (준거법 및 관할)",
      content:
        "이 약관과 관련된 분쟁은 대한민국 법률을 준거법으로 하며, 분쟁 발생 시 회사 소재지를 관할하는 법원을 합의 관할법원으로 합니다.",
    },
  ];

  return (
    <div style={s.overlay}>
      {/* 헤더 */}
      <div style={s.header}>
        <button style={s.backBtn} onClick={onClose}>←</button>
        <div style={s.headerCenter}>
          <span style={s.headerTitle}>서비스 이용약관</span>
        </div>
        <div style={{ width: 32 }} />
      </div>

      {/* 시행일 */}
      <div style={s.effectiveDate}>시행일: 2026년 8월 14일</div>

      {/* 본문 */}
      <div style={s.body}>
        {sections.map((sec, i) => (
          <div key={i} style={s.section}>
            <div style={s.sectionTitle}>{sec.title}</div>
            <div style={s.sectionContent}>{sec.content}</div>
          </div>
        ))}

        {/* 문의 */}
        <div style={s.contactBox}>
          <div style={s.contactTitle}>문의</div>
          <div style={s.contactText}>jihunj624@gmail.com</div>
        </div>

        <div style={{ height: 32 }} />
      </div>
    </div>
  );
}

// ── 스타일 ────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  overlay: {
    position: "absolute", inset: 0,
    background: "#f4f5f8",
    display: "flex", flexDirection: "column",
    zIndex: 300, borderRadius: 32, overflow: "hidden",
  },

  // 헤더
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "16px 20px 14px",
    background: "#1b2338",
    borderBottom: "3px solid #f0b429",
  },
  backBtn: {
    background: "none", border: "none", fontSize: 20,
    cursor: "pointer", color: "#fff", padding: 0,
  },
  headerCenter: {
    display: "flex", flexDirection: "column", alignItems: "center",
  },
  headerTitle: {
    fontSize: 16, fontWeight: 800, color: "#fff",
  },

  effectiveDate: {
    fontSize: 12, color: "#9ca3af",
    padding: "10px 20px",
    background: "#fff",
    borderBottom: "1px solid #f3f4f6",
  },

  body: { flex: 1, overflowY: "auto", padding: "16px 16px 0" },

  section: {
    background: "#fff", borderRadius: 14,
    padding: "16px 18px", marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14, fontWeight: 800, color: "#1b2338",
    marginBottom: 8,
    paddingBottom: 8,
    borderBottom: "1px solid #f3f4f6",
  },
  sectionContent: {
    fontSize: 13.5, color: "#374151",
    lineHeight: 1.7,
  },

  contactBox: {
    background: "#1b2338", borderRadius: 14,
    padding: "16px 18px", marginBottom: 8,
  },
  contactTitle: {
    fontSize: 12, fontWeight: 700, color: "#f0b429",
    letterSpacing: "0.08em", marginBottom: 6,
  },
  contactText: {
    fontSize: 14, color: "#fff",
  },
};
