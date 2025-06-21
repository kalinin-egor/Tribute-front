// ProfilePage.types.ts

export interface ProfilePageProps {
  // Add any props if needed in the future
}

export interface ProfileStats {
  totalTributes: number;
  receivedTributes: number;
  givenTributes: number;
  memberSince: string;
}

export interface SettingItem {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}

export interface ProfilePageState {
  isLoading: boolean;
  stats: ProfileStats;
} 