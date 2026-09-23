// src/components/LockScreen.tsx
import { useState, useEffect } from "react";
import { loadFullScreenAd, showFullScreenAd, IAP } from "@apps-in-toss/web-framework";
import type { AnalysisResult } from "./types";

const INTERSTITIAL_AD_ID = "ait.v2.live.4943c7eeb5404dc7";
const SUBSCRIPTION_SKU   = "sub.1eb3.mszr4qqm.474ef3519a";
const API_BASE           = "https://unfallow.onrender.com";

const isTossApp = () => !!(window as any).ReactNativeWebView;

interface LockScreenProps {
  result:      AnalysisResult;
  userId:      string;
  onWatchAd:   () => void;
  onSubscribe: () => void;
  onDismiss:   () => void;
}

export default function LockScreen({
  result, userId, onWatchAd, onSubscribe, onDismiss,
}: LockScreenProps) {
  const [adLoaded,   setAdLoaded]   = useState(false);
  const [adLoading,  setAdLoading]  = useState(false);
  const [subLoading, setSubLoading] = useState(false);

  useEffect(() => {
    if (!isTossApp()) return;
    const unregister = loadFullScreenAd({
      options: { adGroupId: INTERSTITIAL_AD_ID },
      onEvent: (event) => {
        if (event.type === "loaded") setAdLoaded(true);
      },
      onError: (error) => {
        console.error("광고 로드 실패:", error);
      },
    });
    return () => unregister();
  }, []);

  const handleWatchAd = () => {
    if (!isTossApp() || !adLoaded) {
      onWatchAd();
      return;
    }
    setAdLoading(true);
    showFullScreenAd({
      options: { adGroupId: INTERSTITIAL_AD_ID },
      onEvent: (event) => {
        switch (event.type) {
          case "dismissed":
          case "userEarnedReward":
            setAdLoading(false);
            onWatchAd();
            break;
          case "failedToShow":
            setAdLoading(false);
            onWatchAd();
            break;
        }
      },
      onError: () => {
        setAdLoading(false);
        onWatchAd();
      },
    });
  };

  const handleSubscribe = async () => {
    if (subLoading) return;
    if (!isTossApp()) {
      onSubscribe();
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
            alert("🎉 구독이 활성화되었습니다!");
            onSubscribe();
          }
          setSubLoading(false);
          cleanup();
        },
         onError: (error: any) => {
          console.error("[구독] 결제 오류:", error);
          // ✅ 취소는 오류 메시지 안 띄움
          const isCancelled =
            error?.code === 'USER_CANCELLED' ||
            error?.type === 'cancelled' ||
            error?.message?.toLowerCase().includes('cancel') ||
            error?.message?.includes('취소');
          if (!isCancelled) {
            alert("구독 처리 중 오류가 발생했어요.");
          }
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

  return (
    <div style={s.wrap}>
      <div style={s.bgPreview}>
        <div style={s.bgHero}>
          <div style={s.bgTag}>📁 수사 결과 보고서</div>
          <div style={s.bgBig}>🔒</div>
          <div style={s.bgLabel}>1회차 결과가 잠겨 있어요</div>
          <div style={s.bgSub}>광고를 보면 수사 결과가 열려요</div>
          <button
            style={{ ...s.bgBtn, opacity: (!adLoaded || adLoading) ? 0.6 : 1 }}
            onClick={handleWatchAd}
            disabled={!adLoaded || adLoading}
          >
            {adLoading ? "광고 불러오는 중..." :
             !adLoaded ? "⏳ 광고 준비 중..." :
             "🎬 광고 보고 결과 보기"}
          </button>
          {/* ✅ 구독 버튼 숨김 (SDK 버그 - 코드 유지)
          <button
            style={{ ...s.bgSubBtn, opacity: subLoading ? 0.6 : 1 }}
            onClick={handleSubscribe}
            disabled={subLoading}
          >
            {subLoading ? "결제 처리 중..." : "광고 없이 바로 보기 · 1,100원/월"}
          </button>
          */}
        </div>
      </div>

      <div style={s.sheet}>
        <div style={s.sheetHandle} />
        <div style={s.sheetTitle}>분석이 끝났어요</div>
        <div style={s.sheetDesc}>잠깐 광고를 보시면 전체 결과가 열려요.</div>
        <div style={s.statsRow}>
          <div style={s.statCard}>
            <div style={s.statNum}>{result.followers}</div>
            <div style={s.statLabel}>팔로워</div>
          </div>
          <div style={s.statCard}>
            <div style={s.statNum}>{result.following}</div>
            <div style={s.statLabel}>팔로잉</div>
          </div>
          <div style={{ ...s.statCard, ...s.statLocked }}>
            <div style={s.statLockIcon}>🔒</div>
            <div style={s.statLabel}>언팔</div>
          </div>
          <div style={{ ...s.statCard, ...s.statLocked }}>
            <div style={s.statLockIcon}>🔒</div>
            <div style={s.statLabel}>맞팔</div>
          </div>
        </div>
        <button
          style={{ ...s.adBtn, opacity: (!adLoaded || adLoading) ? 0.6 : 1 }}
          onClick={handleWatchAd}
          disabled={!adLoaded || adLoading}
        >
          {adLoading ? "광고 불러오는 중..." :
           !adLoaded ? "⏳ 광고 준비 중..." :
           "🎬 광고 보고 결과 보기"}
        </button>
        {/* ✅ 구독 버튼 숨김 (SDK 버그 - 코드 유지)
        <button
          style={{ ...s.subBtn, opacity: subLoading ? 0.6 : 1 }}
          onClick={handleSubscribe}
          disabled={subLoading}
        >
          {subLoading ? "결제 처리 중..." : "광고 없이 바로 보기 · 1,100원/월"}
        </button>
        */}
        <button style={s.dismissBtn} onClick={onDismiss}>
          나중에 볼게요
        </button>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  wrap: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", zIndex: 150, borderRadius: 32, overflow: "hidden" },
  bgPreview: { flex: 1, background: "rgba(27,35,56,0.92)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px" },
  bgHero:   { width: "100%", textAlign: "center" },
  bgTag:    { fontSize: 11, fontWeight: 700, color: "#f0b429", letterSpacing: "0.08em", marginBottom: 12 },
  bgBig:    { fontSize: 52, marginBottom: 8 },
  bgLabel:  { fontSize: 18, fontWeight: 900, color: "#fff", marginBottom: 6 },
  bgSub:    { fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 20 },
  bgBtn: { width: "100%", padding: "13px 0", background: "#f0b429", color: "#1b2338", fontSize: 15, fontWeight: 800, borderRadius: 14, border: "none", cursor: "pointer", fontFamily: "inherit", marginBottom: 10, transition: "opacity 0.2s" },
  bgSubBtn: { width: "100%", padding: "10px 0", background: "none", color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600, border: "1.5px solid rgba(255,255,255,0.25)", borderRadius: 12, cursor: "pointer", fontFamily: "inherit" },
  sheet: { background: "#fff", borderRadius: "22px 22px 0 0", padding: "12px 20px 24px", boxShadow: "0 -4px 24px rgba(0,0,0,0.12)" },
  sheetHandle:  { width: 40, height: 4, background: "#e5e7eb", borderRadius: 99, margin: "0 auto 16px" },
  sheetTitle:   { fontSize: 18, fontWeight: 900, color: "#111827", marginBottom: 4 },
  sheetDesc:    { fontSize: 13, color: "#6b7280", marginBottom: 16 },
  statsRow:     { display: "flex", gap: 8, marginBottom: 18 },
  statCard:     { flex: 1, background: "#f9fafb", borderRadius: 12, padding: "12px 4px", textAlign: "center", border: "1px solid #e5e7eb" },
  statLocked:   { background: "#f3f4f6", opacity: 0.7 },
  statNum:      { fontSize: 20, fontWeight: 900, color: "#1b2338" },
  statLockIcon: { fontSize: 18 },
  statLabel:    { fontSize: 11, color: "#9ca3af", marginTop: 4 },
  adBtn: { width: "100%", padding: "14px 0", background: "#1b2338", color: "#f0b429", fontSize: 15, fontWeight: 800, borderRadius: 14, border: "none", cursor: "pointer", fontFamily: "inherit", marginBottom: 10, transition: "opacity 0.2s" },
  subBtn: { width: "100%", padding: "12px 0", background: "#fff", color: "#1b2338", fontSize: 13, fontWeight: 600, border: "1.5px solid #1b2338", borderRadius: 12, cursor: "pointer", fontFamily: "inherit", marginBottom: 8 },
  dismissBtn: { width: "100%", padding: "8px 0", background: "none", color: "#9ca3af", fontSize: 13, border: "none", cursor: "pointer", fontFamily: "inherit" },
};