import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import styles from './Loader.module.css';

interface FoodItem {
  id: number;
  src: string;
  alt: string;
  bgColorClass: string;
}

const foodItems: FoodItem[] = [
  {
    id: 1,
    src: '/loader/burger.svg',
    alt: 'Food item 1',
    bgColorClass: styles.bgColor1,
  },
  {
    id: 2,
    src: '/loader/cuba-libre.svg',
    alt: 'Food item 2',
    bgColorClass: styles.bgColor2,
  },
  {
    id: 3,
    src: '/loader/ice-cream.svg',
    alt: 'Food item 3',
    bgColorClass: styles.bgColor3,
  },
  {
    id: 4,
    src: '/loader/pizza.svg',
    alt: 'Food item 4',
    bgColorClass: styles.bgColor4,
  },
  {
    id: 5,
    src: '/loader/poinsettia.svg',
    alt: 'Food item 5',
    bgColorClass: styles.bgColor5,
  },
];

interface LoaderProps {
  className?: string;
}

const FoodLoader: FC<LoaderProps> = ({ className }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const exiting = useRef<number | null>(null);

  useEffect(() => {
    // Calculate progress percentage
    setProgress(((currentIndex + 1) / foodItems.length) * 100);

    // Setup the timer for image rotation
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        exiting.current = prevIndex;
        return (prevIndex + 1) % foodItems.length;
      });
    }, 1000);

    // Cleanup timer on unmount
    return () => clearInterval(timer);
  }, [currentIndex]);

  // Handle transition end to clear exit state
  const handleTransitionEnd = (id: number) => {
    if (exiting.current === id) {
      exiting.current = null;
    }
  };

  return (
    <div className={clsx(styles.loaderContainer, className)}>
      <div className={styles.mainContainer}>
        {foodItems.map((item, index) => (
          <div
            key={item.id}
            className={clsx(styles.imageContainer, item.bgColorClass, {
              [styles.active]: index === currentIndex,
              [styles.exit]: exiting.current === index,
            })}
            onTransitionEnd={() => handleTransitionEnd(index)}
          >
            <img src={item.src} alt={item.alt} className={styles.foodImage} />
          </div>
        ))}
      </div>
      <div className={styles.loadingText}>Preparing delicious recipes...</div>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default FoodLoader;
