import React from 'react';

interface FeatureItemProps {
  IconComponent: React.ComponentType<{ className?: string }>;
  iconBgColor: string;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ IconComponent, iconBgColor, title, description }) => {
  return (
    <div className="flex items-start space-x-4 animate-slide-up">
      <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${iconBgColor}`}>
        <IconComponent className="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default FeatureItem; 