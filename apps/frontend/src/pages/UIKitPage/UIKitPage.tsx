import clsx from 'clsx';

import AuthBar from '../../components/modules/Auth/AuthBar/AuthBar';
import Button from '../../components/ui/Button/Button';
import Logo from '../../components/ui/Logo/Logo';
import Navigation from '../../components/ui/Navigation/Navigation';

import styles from './UIKitPage.module.css';

const UIKitPage = () => {
  return (
    <div className={styles.kitContainer}>
      <h1>UI Kit</h1>
      <div>
        <h2 className={styles.kitTitle}>Buttons</h2>
        <div className={styles.kitCard}>
          <Button kind="primary" type="submit">
            Publish
          </Button>
          <Button kind="secondary" type="submit">
            Add recipe
          </Button>
          <Button kind="secondary" type="submit" disabled={true}>
            Add recipe
          </Button>
        </div>
        <div className={styles.kitCard}>
          <Button kind="primary" size="small" type="submit">
            Publish
          </Button>
          <Button kind="secondary" size="small" type="submit">
            Add recipe
          </Button>
          <Button kind="secondary" size="small" type="submit" disabled={true}>
            Add recipe
          </Button>
        </div>
      </div>
      <div>
        <h2 className={styles.kitTitle}>Logo</h2>
        <div className="flex gap4">
          <div className={styles.kitCard}>
            <Logo isInversed={false} />
          </div>
          <div className={clsx(styles.kitCard, styles.kitCardDark)}>
            <Logo isInversed={true} />
          </div>
        </div>
      </div>
      <div>
        <h2 className={styles.kitTitle}>Navigation</h2>
        <div className="flex gap4">
          <div className={styles.kitCard}>
            <Navigation isInversed={false} />
          </div>
          <div className={clsx(styles.kitCard, styles.kitCardDark)}>
            <Navigation isInversed={true} />
          </div>
        </div>
      </div>
      <div>
        <h2 className={styles.kitTitle}>AuthBar</h2>
        <div className={clsx(styles.kitCard, styles.kitCardDark)}>
          <AuthBar />
        </div>
      </div>
    </div>
  );
};

export default UIKitPage;
