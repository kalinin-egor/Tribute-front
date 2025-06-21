// MonetizationPage.types.ts

export interface MonetizationPageProps {
  // Add any props if needed in the future
}

export interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  iconBgColor: string;
  title: string;
  description: string;
}

export interface MonetizationPageState {
  termsAccepted: boolean;
}

export interface MonetizationPageHandlers {
  handleMonetizeClick: () => void;
  handleTermsChange: (accepted: boolean) => void;
} 