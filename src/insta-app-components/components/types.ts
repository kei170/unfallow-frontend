// ── 공유 타입 ──────────────────────────────────────────────────

export interface AnalysisResult {
  followers: number;
  following: number;
  unfollowers: string[];
  mutual: string[];
  error: string | null;
}

export interface HistoryEntry {
  date: string;
  unfollowers: number;
  followers: number;
  following: number;
}

// ── 탭 상수 ────────────────────────────────────────────────────
export const TABS = [
  { id: "home",    label: "홈",    icon: "🏠" },
  { id: "report",  label: "리포트", icon: "📊" },
  { id: "sort",    label: "정리",  icon: "🎯" },
  { id: "history", label: "기록",  icon: "📋" },
] as const;
