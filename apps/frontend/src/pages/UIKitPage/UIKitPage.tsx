import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import AuthBar from '../../components/modules/Auth/AuthBar/AuthBar';
import Button from '../../components/ui/Button/Button';
import ButtonWithIcon from '../../components/ui/ButtonWithIcon/ButtonWithIcon';
import Logo from '../../components/ui/Logo/Logo';
import MainTitle from '../../components/ui/MainTitle/MainTitle';
import Navigation from '../../components/ui/Navigation/Navigation';
import PathInfo from '../../components/ui/PathInfo/PathInfo';
import SubTitle from '../../components/ui/SubTitle/SubTitle';

import styles from './UIKitPage.module.css';

const UIKitPage = () => {
  const [text, setText] = useState(
    'Is a healthy salad recipe that’s big on nutrients and flavor. ',
  );
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [text]);

  useEffect(() => {
    window.addEventListener('resize', adjustHeight);
    return () => window.removeEventListener('resize', adjustHeight);
  }, []);

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
          <Button kind="primary" type="submit" disabled={true}>
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
        <div className={styles.kitCard}>
          <Button kind="text" type="button">
            Sign in
          </Button>
        </div>
      </div>
      <div>
        <h2 className={styles.kitTitle}>Buttons</h2>
        <div className={styles.kitCard}>
          <ButtonWithIcon
            kind="primary"
            size="large"
            type="submit"
            iconType="icon-heart"
          />
          <ButtonWithIcon
            kind="secondary"
            size="large"
            type="submit"
            iconType="icon-heart"
          />
          <ButtonWithIcon
            kind="secondary"
            size="large"
            type="submit"
            iconType="icon-heart"
            disabled={true}
          />
        </div>
        <div className={styles.kitCard}>
          <ButtonWithIcon kind="primary" type="submit" iconType="icon-heart" />
          <ButtonWithIcon
            kind="secondary"
            type="submit"
            iconType="icon-heart"
          />
          <ButtonWithIcon
            kind="primary"
            type="submit"
            disabled={true}
            iconType="icon-heart"
          />
        </div>
        <div className={styles.kitCard}>
          <ButtonWithIcon
            kind="primary"
            size="small"
            type="submit"
            iconType="icon-heart"
          />
          <ButtonWithIcon
            kind="secondary"
            size="small"
            type="submit"
            iconType="icon-heart"
          />
          <ButtonWithIcon
            kind="secondary"
            size="small"
            type="submit"
            iconType="icon-heart"
            disabled={true}
          />
        </div>
        <div className={clsx(styles.kitCard, styles.kitCardDark)}>
          <ButtonWithIcon
            kind="ghost"
            size="large"
            type="submit"
            iconType="icon-heart"
          />
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
      <div>
        <h2 className={styles.kitTitle}>Input</h2>
        <div className={clsx(styles.kitCard)}>
          <div className="inputWrapper inputWrapperFilled">
            <input
              className="input"
              value="Julia"
              type="text"
              placeholder="Name*"
            />
          </div>
          <div className="inputWrapper">
            <input className="input" type="text" placeholder="Name*" />
          </div>
          <div className="inputWrapper inputWrapperInvalid">
            <input className="input" type="text" placeholder="Name*" />
          </div>
          <div className="inputWrapper inputWrapperInvalid">
            <input className="input" type="text" placeholder="Name*" />
            <span className="inputError">Name is required</span>
          </div>
        </div>
      </div>
      <div>
        <h2 className={styles.kitTitle}>TextArea with count</h2>
        <div className={clsx(styles.kitCard)}>
          <div className="textAreaWrapper textAreaWrapperCounter">
            <textarea
              className="textArea"
              ref={textareaRef}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
              }}
              maxLength={200}
              rows={1}
              placeholder="Enter a description"
            />
            <div className="textAreaCounter">
              <span className={text.length ? 'textAreaCounterCurrent' : ''}>
                {text.length}
              </span>
              <span>/200</span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2 className={styles.kitTitle}>TextArea</h2>
        <div className={clsx(styles.kitCard)}>
          <div className="textAreaWrapper">
            <textarea
              className="textArea"
              rows={1}
              placeholder="Enter quantity"
            />
          </div>
          <div className="textAreaWrapper textAreaWrapperInvalid">
            <textarea
              className="textArea"
              rows={1}
              placeholder="Enter quantity"
            />
            <span className="textAreaError">Quantity isrequired</span>
          </div>
        </div>
      </div>
      <div>
        <h2 className={styles.kitTitle}>Main Title/Sub Title</h2>
        <div className={clsx(styles.kitCard)}>
          <div className="flex column">
            <MainTitle title="Categories" />
            <SubTitle title="Discover a limitless world of culinary possibilities and enjoy exquisite recipes that combine taste, style and the warm atmosphere of the kitchen." />
          </div>
        </div>
      </div>
      <div>
        <h2 className={styles.kitTitle}>Path Info</h2>
        <div className={clsx(styles.kitCard)}>
          <PathInfo
            pages={[
              { name: 'Home', path: '/' },
              { name: 'Add Recipe', path: '/add-recipe' },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default UIKitPage;
