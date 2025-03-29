import type { ChangeEvent } from 'react';

import ButtonWithIcon from '../ButtonWithIcon/ButtonWithIcon';

import styles from './UploadButton.module.css';

type UploadRecipePhotoProps = {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
};

const UploadButton = ({
  onFileSelect,
  isLoading = false,
}: UploadRecipePhotoProps) => {
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedImage = e.target.files[0];
    onFileSelect(selectedImage);
  };

  const fileClickHandler = () => {
    (
      document.querySelector(`.${styles.uploadInput}`) as HTMLInputElement
    )?.click();
  };

  return (
    <div>
      <ButtonWithIcon
        kind="primary"
        size="small"
        type="submit"
        iconType="icon-plus"
        clickHandler={fileClickHandler}
        busy={isLoading}
        disabled={isLoading}
      />
      <input
        className={styles.uploadInput}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
    </div>
  );
};

export default UploadButton;
