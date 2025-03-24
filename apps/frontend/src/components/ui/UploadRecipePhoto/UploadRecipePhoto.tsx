import type { ChangeEvent } from 'react';
import { useState } from 'react';

import styles from './UploadRecipePhoto.module.css';

const UploadRecipePhoto = () => {
  // ToDo: dispatch selected image to "recipes" redux store
  // or declare and submit it in the parent component
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedImage = e.target.files[0];
    setImage(selectedImage);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedImage);
  };

  return (
    <div className={styles.uploadRecipePhoto}>
      <label className={styles.uploadLabel}>
        {preview ? (
          <img className={styles.previewImage} src={preview} alt="Preview" />
        ) : (
          <>
            <svg
              className={styles.uploadIcon}
              onClick={() =>
                (
                  document.querySelector(
                    `.${styles.uploadInput}`,
                  ) as HTMLInputElement
                )?.click()
              }
            >
              <use href={`/icons.svg#icon-camera`}></use>
            </svg>
            <p className={styles.noFileSelectedText}>Upload a photo</p>
          </>
        )}
        <input
          className={styles.uploadInput}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </label>
    </div>
  );
};

export default UploadRecipePhoto;
