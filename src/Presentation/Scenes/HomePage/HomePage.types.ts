// HomePage.types.ts

export interface HomePageProps {
  // Add any props if needed in the future
}

export interface UserStats {
  totalTributes: number;
  receivedTributes: number;
  givenTributes: number;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  iconColor: 'primary' | 'green' | 'purple';
}

export interface HomePageState {
  isLoading: boolean;
  stats: UserStats;
} 