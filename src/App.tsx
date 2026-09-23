import { useState, useEffect } from "react";
import { IAP } from "@apps-in-toss/web-framework";  // ✅ 추가
import { getDeviceId } from "@apps-in-toss/web-framework";


// ── 컴포넌트 임포트 ────────────────────────────────────────────
import LockScreen from "./insta-app-components/components/LockScreen";
import GuideView    from "./insta-app-components/components/GuideView";
import HomeTab      from "./insta-app-components/components/HomeTab";
import ReportTab    from "./insta-app-components/components/ReportTab";
import SortTab      from "./insta-app-components/components/SortTab";
import HistoryTab   from "./insta-app-components/components/HistoryTab";
import SettingsView from "./insta-app-components/components/SettingsView";
import { AnalysisResult, HistoryEntry } from "./insta-app-components/components/types";

// ── 디자인 토큰 ───────────────────────────────────────────────
export const T = {
  navy:      "#1b2338",
  navyLight: "#252e45",
  gold:      "#f0b429",
  goldLight: "#fef9e7",
  bg:        "#f4f5f8",
  white:     "#ffffff",
  text:      "#111827",
  muted:     "#6b7280",
  border:    "#e5e7eb",
  red:       "#ef4444",
  green:     "#22c55e",
};

// ── 탭 정의 ───────────────────────────────────────────────────
const DETECTIVE_TABS = [
  { id: "home",    label: "수사",   icon: "🔍" },
  { id: "report",  label: "리포트", icon: "📋" },
  { id: "sort",    label: "용의자", icon: "🎯" },
  { id: "history", label: "기록",   icon: "🗂️" },
];

// ── 백엔드 주소 ───────────────────────────────────────────────
const API_BASE = "https://unfallow.onrender.com";

// ── 유저 ID 조회 ──────────────────────────────────────────────
const USER_ID_KEY = "unfollow_user_id";

function getFallbackId(): string {
  try {
    let id = localStorage.getItem(USER_ID_KEY);
    if (!id) {
      id = `u_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(USER_ID_KEY, id);
    }
    return id;
  } catch {
    return `u_temp_${Math.random().toString(36).slice(2, 10)}`;
  }
}

async function resolveUserId(): Promise<string> {
  try {
    const deviceId = await getDeviceId();
    if (deviceId) return deviceId;
  } catch (e) {
    console.warn("getDeviceId 실패, localStorage로 대체:", e);
  }
  return getFallbackId();
}

// ✅ 유저 행동 로그 서버에 저장
async function logUserAction(userId: string, action: string) {
  if (!userId) return;
  try {
    await fetch(`${API_BASE}/api/unfollow/analysis-log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, type: action }),
    });
  } catch (e) {
    console.warn("[로그] 저장 실패:", e);
  }
}

// ── 수사대 배지 아이콘 ────────────────────────────────────────
const BadgeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="12" cy="12" r="8" stroke="#f0b429" strokeWidth="2.2"/>
    <line x1="18.5" y1="18.5" x2="25" y2="25" stroke="#f0b429" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="4" fill="#f0b429" fillOpacity="0.25"/>
  </svg>
);

// ── 메인 앱 ──────────────────────────────────────────────────
export default function App() {
  const [activeTab,    setActiveTab]    = useState<string>("home");
  const [showGuide,    setShowGuide]    = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLock,     setShowLock]     = useState(false); // ✅ 추가
  const [result,       setResult]       = useState<AnalysisResult | null>(null);
  const [history,      setHistory]      = useState<HistoryEntry[]>([]);
  const [userId,       setUserId]       = useState<string>("");

  // ✅ 미지급 구독 복구 (SDK 2.6.2 버그 대응)
useEffect(() => {
  if (!userId) return;
  if (!(window as any).ReactNativeWebView) return; // ← 추가

  const recoverPendingOrders = async () => {
    try {
      const result = await IAP.getPendingOrders();
      if (!result?.orders?.length) return;

      for (const order of result.orders) {
        const res = await fetch(`${API_BASE}/api/unfollow/premium-activate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            orderId: order.orderId,
            subscriptionId: (order as any).subscriptionId || null,
          }),
        });
        const data = await res.json();
        if (data.success) {
          await IAP.completeProductGrant({ params: { orderId: order.orderId } }); // ← params 제거
          logUserAction(userId, "subscribe_recovered");
        }
      }
    } catch (e) {
      console.warn("[구독복구] 실패:", e);
    }
  };

  recoverPendingOrders();
}, [userId]);

  // ✅ 유저 ID 초기화 + 앱 진입 로그
  useEffect(() => {
    resolveUserId().then(id => {
      setUserId(id);
      logUserAction(id, "app_open");
    });
  }, []);

  const handleResultReady = (res: AnalysisResult, entry: HistoryEntry) => {
    setResult(res);
    setHistory(prev => [entry, ...prev.slice(0, 9)]);
    setShowLock(true); // ✅ 결과 나오면 LockScreen 표시
  };
  const handleReset = () => {
    setResult(null);
    setShowLock(false);
  };

  return (
    <div style={S.shell}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        button { font-family: inherit; }
        input  { font-family: inherit; }
      `}</style>

      <div style={S.app}>
        {/* ── 오버레이 ── */}
        {showGuide && <GuideView onClose={() => {
          logUserAction(userId, "guide_close");
          setShowGuide(false);
        }} />}

        {showSettings && (
          <SettingsView
            userId={userId}
            onClose={() => {
              logUserAction(userId, "settings_close");
              setShowSettings(false);
            }}
          />
        )}

        {/* ✅ LockScreen 오버레이 */}
        {showLock && result && (
          <LockScreen
            result={result}
            userId={userId}
            onWatchAd={() => {
              logUserAction(userId, "ad_watched");
              setShowLock(false);
            }}
            onSubscribe={() => {
              logUserAction(userId, "subscribe_success");
              setShowLock(false);
            }}
            onDismiss={() => {
              logUserAction(userId, "lock_dismissed");
              setShowLock(false);
            }}
          />
        )}

        {/* ── 헤더 ── */}
        <div style={S.header}>
          <div style={S.headerLeft}>
            <BadgeIcon />
            <div>
              <div style={S.headerTitle}>인스타 언팔 수사대</div>
            </div>
          </div>
          <button
            style={S.gearBtn}
            onClick={() => {
              logUserAction(userId, "settings_open");  // ✅ 설정 클릭
              setShowSettings(true);
            }}
            aria-label="설정"
          >
            ⚙️
          </button>
        </div>

        {/* ── 탭 콘텐츠 ── */}
        <div style={S.body}>
          {activeTab === "home"    && (
            <HomeTab
              userId={userId}
              onShowGuide={() => {
                logUserAction(userId, "guide_open");  // ✅ 가이드 클릭
                setShowGuide(true);
              }}
              onResultReady={handleResultReady}
              result={result}
              onReset={handleReset}
            />
          )}
          {activeTab === "report"  && <ReportTab  result={result} />}
          {activeTab === "sort"    && <SortTab    result={result} />}
          {activeTab === "history" && <HistoryTab history={history} />}
        </div>

        {/* ── 하단 탭바 (플로팅) ── */}
        <div style={S.tabBarWrap}>
          <div style={S.tabBar}>
            {DETECTIVE_TABS.map(tab => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  style={{
                    ...S.tabBtn,
                    background: active ? "rgba(240,180,41,0.12)" : "transparent",
                  }}
                  onClick={() => {
                    logUserAction(userId, `tab_${tab.id}`);  // ✅ 탭 클릭
                    setActiveTab(tab.id);
                  }}
                >
                  <span style={{ fontSize: 19, lineHeight: 1 }}>{tab.icon}</span>
                  <span style={{
                    fontSize: 10,
                    fontWeight: active ? 800 : 500,
                    color: active ? "#f0b429" : "#9ca3af",
                  }}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 스타일 ────────────────────────────────────────────────────
const S: Record<string, React.CSSProperties> = {
  shell: {
    display: "flex", justifyContent: "center", alignItems: "center",
    minHeight: "100vh", background: "#e8eaf0",
    fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif",
  },
  app: {
    width: 390, minHeight: 700, maxHeight: 860,
    background: "#f4f5f8",
    borderRadius: 32,
    boxShadow: "0 12px 56px rgba(0,0,0,0.18)",
    display: "flex", flexDirection: "column",
    overflow: "hidden", position: "relative",
  },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "16px 20px 14px",
    background: "#1b2338",
    borderBottom: "3px solid #f0b429",
  },
  headerLeft: {
    display: "flex", alignItems: "center", gap: 10,
  },
  headerTitle: {
    fontSize: 18, fontWeight: 900, color: "#ffffff",
    letterSpacing: "-0.01em", lineHeight: 1.2,
  },
  gearBtn: {
    background: "none", border: "none", fontSize: 18,
    cursor: "pointer", padding: "4px 6px", borderRadius: 8,
    lineHeight: 1,
  },
  body: {
    flex: 1,
    overflowY: "auto",
    background: "#f4f5f8",
    paddingBottom: 90,
  },
    tabBarWrap: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    padding: "0 20px 24px",
    pointerEvents: "none",
  },
  tabBar: {
    display: "flex",
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "saturate(180%) blur(24px)",
    WebkitBackdropFilter: "saturate(180%) blur(24px)",
    borderRadius: 28,
    padding: "6px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.04)",
    border: "0.5px solid rgba(0,0,0,0.04)",
    pointerEvents: "auto",
  },
  tabBtn: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    border: "none",
    cursor: "pointer",
    padding: "9px 0",
    borderRadius: 22,
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  },
};
