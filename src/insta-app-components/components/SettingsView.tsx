// src/components/SettingsView.tsx
import { useState, useEffect } from "react";
import { IAP } from "@apps-in-toss/web-framework";
import TermsView   from "./TermsView";
import PrivacyView from "./PrivacyView";
import AdInfoView  from "./AdInfoView";

// ✅ 구독 상품 SKU
const SUBSCRIPTION_SKU = "sub.1eb3.mszr4qqm.474ef3519a";

// ✅ 백엔드 주소
const API_BASE = "https://unfallow.onrender.com";

// 토스 앱 환경 체크
const isTossApp = () => !!(window as any).ReactNativeWebView;

interface SettingsViewProps {
  userId:  string;
  onClose: () => void;
}

export default function SettingsView({ userId, onClose }: SettingsViewProps) {
  const [showTerms,   setShowTerms]   = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showAdInfo,  setShowAdInfo]  = useState(false);

  const [isPremium,  setIsPremium]  = useState(false);
  const [checking,   setChecking]   = useState(true);
  const [subLoading, setSubLoading] = useState(false);

  // ── 구독 상태 조회 ────────────────────────────────────────
  useEffect(() => {
    if (!userId) return;
    fetch(`${API_BASE}/api/unfollow/premium-status/${userId}`, {
      signal: AbortSignal.timeout(10000),
    })
      .then(r => r.json())
      .then(d => setIsPremium(d.isPremium === true))
      .catch(() => setIsPremium(false))
      .finally(() => setChecking(false));
  }, [userId]);

  // ── 구독 결제 ─────────────────────────────────────────────
  const handleSubscribe = async () => {
    if (subLoading || isPremium) return;

    if (!isTossApp()) {
      alert("토스 앱에서만 구독할 수 있어요.");
      return;
    }

    setSubLoading(true);
    try {
      const productList = await IAP.getProductItemList();
      if (!productList || !productList.products) {
        alert("상품 정보를 불러올 수 없어요.");
        setSubLoading(false);
        return;
      }

      const subProduct =
        productList.products.find((p: any) => p.sku === SUBSCRIPTION_SKU) ||
        productList.products.find((p: any) => p.type === "SUBSCRIPTION");

      if (!subProduct) {
        alert("구독 상품이 등록되지 않았어요.");
        setSubLoading(false);
        return;
      }

      const freeTrialOffer = (subProduct as any).offers?.find(
        (o: any) => o.type === "FREE_TRIAL"
      );

      const cleanup = IAP.createSubscriptionPurchaseOrder({
        options: {
          sku: subProduct.sku,
          offerId: freeTrialOffer?.offerId || null,
          processProductGrant: async ({ orderId, subscriptionId }: any) => {
            try {
              const res = await fetch(`${API_BASE}/api/unfollow/premium-activate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, orderId, subscriptionId }),
              });
              const data = await res.json();
              return data.success === true;
            } catch {
              return false;
            }
          },
        },
        onEvent: (event: any) => {
          if (event.type === "success") {
            setIsPremium(true);
            alert("🎉 구독이 활성화되었습니다!");
          }
          setSubLoading(false);
          cleanup();
        },
        onError: (error: unknown) => {
          console.error("[구독] 결제 오류:", error);
          setSubLoading(false);
          cleanup();
        },
      });
    } catch (err) {
      console.error("[구독] 오류:", err);
      alert("구독 처리 중 오류가 발생했어요.");
      setSubLoading(false);
    }
  };

  const policyItems = [
    { label: "서비스 이용약관",  onPress: () => setShowTerms(true) },
    { label: "개인정보처리방침",  onPress: () => setShowPrivacy(true) },
    { label: "광고 안내",        onPress: () => setShowAdInfo(true) },
  ];

  return (
    <div style={s.overlay}>

      {showTerms   && <TermsView   onClose={() => setShowTerms(false)} />}
      {showPrivacy && <PrivacyView onClose={() => setShowPrivacy(false)} />}
      {showAdInfo  && <AdInfoView  onClose={() => setShowAdInfo(false)} />}

      {/* ── 헤더 ── */}
      <div style={s.header}>
        <button style={s.backBtn} onClick={onClose}>←</button>
        <div style={s.headerCenter}>
          <span style={s.headerTitle}>인스타 언팔 수사대</span>
          <span style={s.headerSub}>SETTINGS</span>
        </div>
        <span style={{ fontSize: 20, opacity: 0.6 }}>⚙️</span>
      </div>

      {/* ── 본문 ── */}
      <div style={s.body}>

        {/* ✅ 구독 카드 숨김 (SDK 버그 - 코드 유지)
        {isPremium ? (
          <div style={s.activeCard}>
            <div style={s.activeBadge}>✓ PRO 이용 중</div>
            <div style={s.activeTitle}>광고 없이 수사 중이에요</div>
            <div style={s.activeDesc}>
              결과 열람 광고 없음 · 배너 광고 없음
            </div>
            <div style={s.activeNote}>
              구독 해지는 토스 앱 → 설정 → 구독 관리에서 할 수 있어요.
            </div>
          </div>
        ) : (
          <div style={s.proCard}>
            <div style={s.proBadge}>🔍 PRO</div>
            <div style={s.proTitle}>광고 없이 수사하기</div>
            <div style={s.proDesc}>
              1,100원/월 · 결과 열람 광고 없음 · 배너 광고 없음
            </div>
            <button
              style={{
                ...s.proBtn,
                opacity: (checking || subLoading) ? 0.6 : 1,
                cursor:  (checking || subLoading) ? "not-allowed" : "pointer",
              }}
              onClick={handleSubscribe}
              disabled={checking || subLoading}
            >
              {checking   ? "확인 중..." :
               subLoading ? "결제 처리 중..." :
               "광고 없이 수사 시작"}
            </button>
          </div>
        )}
        */}

        {/* 약관 및 정책 */}
        <div style={s.sectionLabel}>약관 및 정책</div>
        <div style={s.card}>
          {policyItems.map((item, i) => (
            <button
              key={item.label}
              style={{
                ...s.listRow,
                borderBottom: i < policyItems.length - 1 ? "1px solid #f3f4f6" : "none",
              }}
              onClick={item.onPress}
            >
              <span style={s.listText}>{item.label}</span>
              <span style={s.listChevron}>›</span>
            </button>
          ))}
        </div>

        {/* 정보 */}
        <div style={s.sectionLabel}>정보</div>
        <div style={s.card}>
          {[
            ["버전", "1.0.0"],
            ["문의", "jihunj624@gmail.com"],
          ].map(([label, value], i, arr) => (
            <div
              key={label}
              style={{
                ...s.listRow,
                borderBottom: i < arr.length - 1 ? "1px solid #f3f4f6" : "none",
                cursor: "default",
              }}
            >
              <span style={s.listText}>{label}</span>
              <span style={{ fontSize: 13, color: "#9ca3af" }}>{value}</span>
            </div>
          ))}
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
    zIndex: 100, borderRadius: 32, overflow: "hidden",
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
    fontSize: 16, fontWeight: 900, color: "#fff",
    letterSpacing: "-0.01em", lineHeight: 1.2,
  },
  headerSub: {
    fontSize: 9, fontWeight: 700, color: "#f0b429",
    letterSpacing: "0.14em", marginTop: 1,
  },
  body: { flex: 1, overflowY: "auto", padding: "20px 16px 0" },

  // 미구독 카드
  proCard: {
    background: "#1b2338", borderRadius: 18,
    overflow: "hidden", marginBottom: 8,
    padding: "18px", position: "relative",
  },
  proBadge: {
    display: "inline-block", background: "#f0b429", color: "#1b2338",
    fontSize: 11, fontWeight: 900, padding: "3px 10px",
    borderRadius: 20, marginBottom: 10, letterSpacing: "0.05em",
  },
  proTitle: { fontSize: 17, fontWeight: 900, color: "#fff", marginBottom: 6 },
  proDesc:  { fontSize: 12.5, color: "rgba(255,255,255,0.6)", marginBottom: 16, lineHeight: 1.5 },
  proBtn: {
    display: "block", width: "100%", padding: "13px 0",
    background: "#f0b429", color: "#1b2338",
    fontSize: 15, fontWeight: 800, borderRadius: 12,
    border: "none", fontFamily: "inherit",
    transition: "opacity 0.2s",
  },
  proNote: { fontSize: 12, color: "rgba(255,255,255,0.4)", padding: "10px 0 0", textAlign: "center" },

  // ✅ 구독 중 카드
  activeCard: {
    background: "linear-gradient(135deg, #1b2338 0%, #2d3a5c 100%)",
    borderRadius: 18, marginBottom: 8, padding: "18px",
    border: "1.5px solid #f0b429",
  },
  activeBadge: {
    display: "inline-block", background: "#22c55e", color: "#fff",
    fontSize: 11, fontWeight: 900, padding: "3px 10px",
    borderRadius: 20, marginBottom: 10, letterSpacing: "0.03em",
  },
  activeTitle: { fontSize: 17, fontWeight: 900, color: "#fff", marginBottom: 6 },
  activeDesc:  { fontSize: 12.5, color: "rgba(255,255,255,0.65)", marginBottom: 14, lineHeight: 1.5 },
  activeNote: {
    fontSize: 11.5, color: "rgba(255,255,255,0.45)",
    paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.12)",
    lineHeight: 1.5,
  },

  sectionLabel: {
    fontSize: 13, fontWeight: 700, color: "#6b7280",
    padding: "16px 4px 8px", letterSpacing: "0.02em",
  },
  card: { background: "#fff", borderRadius: 16, overflow: "hidden", marginBottom: 8 },
  listRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "15px 18px", width: "100%",
    background: "none", border: "none",
    cursor: "pointer", fontFamily: "inherit", textAlign: "left",
  },
  listText:    { fontSize: 14, color: "#111827" },
  listChevron: { fontSize: 18, color: "#d1d5db" },
};
