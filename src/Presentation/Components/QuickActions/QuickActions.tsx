import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChannelDTO } from '../../../Domain/types';
import styles from './QuickActions.module.css';
import StoryViewer from '../../Scenes/CreatorDashboardPage/components/StoryViewer/StoryViewer';

// @ts-ignore
const images = require.context('../../../assets/quickActions', true, /\.png$/);

const getSlides = (folder: string, count: number) => {
  const slides = [];
  for (let i = 1; i <= count; i++) {
    try {
      slides.push(images(`./${folder}/${i}.png`));
    } catch (e) {
      console.warn(`Could not load slide ./${folder}/${i}.png`);
    }
  }
  return slides;
};

const initialActions = [
    { id: 'channels-and-groups', title: 'Channels and Groups', icon: '👥', watched: false, color: '#a97fff', slides: [] },
    { id: 'physical-products-guide', title: 'Physical products guide', icon: images('./physical-products-guide/1.png'), watched: false, color: '#5ac8fa', slides: getSlides('physical-products-guide', 5) },
    { id: 'how-to-create-a-referal-offer', title: 'How to create a referral offer', icon: images('./how-to-create-a-referal-offer/1.png'), watched: true, color: '#ffcc00', slides: getSlides('how-to-create-a-referal-offer', 7) },
    { id: 'how-to-create-a-fundraising-goal', title: 'How to create a fundraising goal', icon: images('./how-to-create-a-fundraising-goal/1.png'), watched: false, color: '#78cbf2', slides: getSlides('how-to-create-a-fundraising-goal', 5) },
    { id: 'are-your-subscribers-willing-to-pay', title: 'Are your subscribers willing to pay?', icon: images('./are-your-subscribers-willing-to-pay/1.png'), watched: false, color: '#ff6b6b', slides: getSlides('are-your-subscribers-willing-to-pay', 4) },
    { id: 'custom-products', title: 'Custom products', icon: images('./custom-products/1.png'), watched: false, color: '#48dbfb', slides: getSlides('custom-products', 8) },
    { id: 'monetization-methods', title: 'Monetization methods', icon: images('./monetization-methods/1.png'), watched: false, color: '#1dd1a1', slides: getSlides('monetization-methods', 5) },
];

interface QuickActionsProps {
  channels: ChannelDTO[];
  isSubPublished: boolean;
  onRefresh: () => Promise<void>;
}

const QuickActions: React.FC<QuickActionsProps> = ({ channels, isSubPublished, onRefresh }) => {
  const [actions, setActions] = useState(initialActions);
  const [activeStory, setActiveStory] = useState<any | null>(null);
  const navigate = useNavigate();

  const handleActionClick = (action: any) => {
    if (action.id === 'channels-and-groups') {
      navigate('/channels');
      return;
    }
    
    if (action.slides.length > 0) {
      setActiveStory(action);
    }
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
            {action.id === 'channels-and-groups' ? 
              <div className={styles.channelsIcon}>{action.icon}</div> :
              <img src={action.icon} alt="" className={styles.icon} />
            }
            <p>{action.title}</p>
          </div>
        ))}
      </div>
      
      {/* Show channel status */}
      <div className={styles.channelStatus}>
        <h3>Your Channels ({channels.length})</h3>
        {channels.length > 0 ? (
          <div className={styles.channelsList}>
            {channels.map((channel, index) => (
              <div key={index} className={styles.channelItem}>
                <span>@{channel.channel_username}</span>
                {isSubPublished && <span className={styles.published}>✓ Published</span>}
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.noChannels}>No channels connected yet</p>
        )}
      </div>
      
      {activeStory && <StoryViewer slides={activeStory.slides} onClose={handleCloseViewer} />}
    </>
  );
};

export default QuickActions; 