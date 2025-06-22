import React, { useState } from 'react';
import styles from './QuickActions.module.css';
import StoryViewer from '../StoryViewer/StoryViewer';

// Use require.context to dynamically import all pngs from the quickActions directory.
// This allows webpack to correctly bundle all the necessary images at build time.
// @ts-ignore
const images = require.context('../../../../../assets/quickActions', true, /\.png$/);

// Helper to generate slide paths using the context
const getSlides = (folder: string, count: number) => {
  const slides = [];
  for (let i = 1; i <= count; i++) {
    const path = `./${folder}/${i}.png`;
    slides.push(images(path));
  }
  return slides;
};

// Placeholder data - we'll need real icon paths and story content
const initialActions = [
  { id: 'add-a-manager-to-your-channel', title: 'Add a manager to your channel', icon: images('./add-a-manager-to-your-channel/1.png'), watched: false, color: '#a97fff', slides: getSlides('add-a-manager-to-your-channel', 5) },
  { id: 'physical-products-guide', title: 'Physical products guide', icon: images('./physical-products-guide/1.png'), watched: false, color: '#5ac8fa', slides: getSlides('physical-products-guide', 5) },
  { id: 'how-to-create-a-referal-offer', title: 'How to create a referral offer', icon: images('./how-to-create-a-referal-offer/1.png'), watched: true, color: '#ffcc00', slides: getSlides('how-to-create-a-referal-offer', 5) },
  { id: 'how-to-create-a-fundraising-goal', title: 'How to create a fundraising goal', icon: images('./how-to-create-a-fundraising-goal/1.png'), watched: false, color: '#78cbf2', slides: getSlides('how-to-create-a-fundraising-goal', 5) },
];

const QuickActions: React.FC = () => {
  const [actions, setActions] = useState(initialActions);
  const [activeStory, setActiveStory] = useState<any | null>(null);

  const handleActionClick = (action: any) => {
    setActiveStory(action);
  };

  const handleCloseViewer = () => {
    if (activeStory) {
      const newActions = actions.map(a =>
        a.id === activeStory.id ? { ...a, watched: true } : a
      );
      setActions(newActions);
    }
    setActiveStory(null);
  };

  return (
    <>
      <div className={styles.quickActionsContainer}>
        {actions.map((action, index) => (
          <div
            key={index}
            className={`${styles.actionCard} ${action.watched ? styles.watched : styles.unwatched}`}
            style={{ backgroundColor: action.color }}
            onClick={() => handleActionClick(action)}
          >
            <img src={action.icon} alt="" className={styles.icon} />
            <p>{action.title}</p>
          </div>
        ))}
      </div>
      {activeStory && <StoryViewer slides={activeStory.slides} onClose={handleCloseViewer} />}
    </>
  );
};

export default QuickActions; 