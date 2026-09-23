// src/components/PrivacyView.tsx

interface PrivacyViewProps {
  onClose: () => void;
}

export default function PrivacyView({ onClose }: PrivacyViewProps) {
  const sections = [
    {
      title: "제1조 (수집하는 개인정보)",
      content:
        "인스타 언팔 수사대는 어떠한 개인정보도 수집하지 않습니다. 이용자가 업로드하는 인스타그램 데이터 파일은 이용자 기기 내에서만 처리되며, 회사 서버로 전송되거나 저장되지 않습니다.",
    },
    {
      title: "제2조 (개인정보의 처리 방법)",
      content:
        "업로드된 파일은 브라우저 메모리 내에서 분석 후 즉시 삭제됩니다. 분석 결과(팔로워 수, 팔로잉 수, 언팔 수 등 통계 수치)는 이용자 기기의 로컬 저장소에만 보관되며, 외부로 전송되지 않습니다.",
    },
    {
      title: "제3조 (개인정보의 제3자 제공)",
      content:
        "회사는 이용자의 개인정보를 제3자에게 제공하지 않습니다. 서비스 특성상 개인정보 자체를 수집하지 않으므로 제3자 제공이 발생하지 않습니다.",
    },
    {
      title: "제4조 (개인정보의 보유 및 이용기간)",
      content:
        "회사는 개인정보를 수집·보유하지 않습니다. 이용자가 기기 내 앱 데이터를 삭제하면 로컬에 저장된 분석 기록도 함께 삭제됩니다.",
    },
    {
      title: "제5조 (이용자의 권리)",
      content:
        "이용자는 언제든지 앱 설정의 '앱 초기화' 기능을 통해 기기에 저장된 분석 기록을 삭제할 수 있습니다. 회사가 개인정보를 보유하지 않으므로 별도의 열람·정정·삭제 요청 절차는 필요하지 않습니다.",
    },
    {
      title: "제6조 (쿠키 및 추적 기술)",
      content:
        "서비스는 쿠키, 광고 식별자, 위치 정보 등 어떠한 추적 기술도 사용하지 않습니다. 토스 플랫폼 자체의 광고 SDK는 토스의 개인정보처리방침을 따릅니다.",
    },
    {
      title: "제7조 (개인정보 보호책임자)",
      content:
        "개인정보 관련 문의는 아래 연락처로 접수해주세요.\n\n담당자: ChatJAVIS\n이메일: jihunj624@gmail.com\n\n문의 접수 후 영업일 기준 3일 이내에 답변드립니다.",
    },
    {
      title: "제8조 (방침의 변경)",
      content:
        "개인정보처리방침을 변경하는 경우 서비스 내 공지를 통해 사전에 안내드립니다. 변경된 방침은 공지 후 7일이 경과한 날부터 효력이 발생합니다.",
    },
  ];

  return (
    <div style={s.overlay}>
      {/* 헤더 */}
      <div style={s.header}>
        <button style={s.backBtn} onClick={onClose}>←</button>
        <div style={s.headerCenter}>
          <span style={s.headerTitle}>개인정보처리방침</span>
        </div>
        <div style={{ width: 32 }} />
      </div>

      {/* 시행일 */}
      <div style={s.effectiveDate}>시행일: 2026년 8월 14일</div>

      {/* 핵심 요약 배지 */}
      <div style={s.summaryBox}>
        <div style={s.summaryIcon}>🔒</div>
        <div>
          <div style={s.summaryTitle}>개인정보를 수집하지 않아요</div>
          <div style={s.summaryDesc}>
            모든 분석은 기기 안에서만 처리되고,<br />
            서버로 전송되는 데이터는 없어요.
          </div>
        </div>
      </div>

      {/* 본문 */}
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

        {/* 문의 */}
        <div style={s.contactBox}>
          <div style={s.contactTitle}>개인정보 문의</div>
          <div style={s.contactText}>jihunj624@gmail.com</div>
        </div>

        <div style={{ height: 32 }} />
      </div>
    </div>
  );
}

// ── 스타일 ─────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  overlay: {
    position: "absolute", inset: 0,
    background: "#f4f5f8",
    display: "flex", flexDirection: "column",
    zIndex: 300, borderRadius: 32, overflow: "hidden",
  },

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

  // 핵심 요약 배지
  summaryBox: {
    display: "flex", alignItems: "center", gap: 14,
    background: "#fef9e7",
    borderBottom: "1px solid #fde68a",
    padding: "14px 20px",
  },
  summaryIcon: { fontSize: 28, flexShrink: 0 },
  summaryTitle: { fontSize: 14, fontWeight: 800, color: "#1b2338", marginBottom: 4 },
  summaryDesc:  { fontSize: 12.5, color: "#6b7280", lineHeight: 1.55 },

  body: { flex: 1, overflowY: "auto", padding: "16px 16px 0" },

  section: {
    background: "#fff", borderRadius: 14,
    padding: "16px 18px", marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14, fontWeight: 800, color: "#1b2338",
    marginBottom: 8, paddingBottom: 8,
    borderBottom: "1px solid #f3f4f6",
  },
  sectionContent: {
    fontSize: 13.5, color: "#374151", lineHeight: 1.7,
  },

  contactBox: {
    background: "#1b2338", borderRadius: 14,
    padding: "16px 18px", marginBottom: 8,
  },
  contactTitle: {
    fontSize: 12, fontWeight: 700, color: "#f0b429",
    letterSpacing: "0.08em", marginBottom: 6,
  },
  contactText: { fontSize: 14, color: "#fff" },
};
