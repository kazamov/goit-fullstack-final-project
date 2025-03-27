import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

import styles from './UploadRecipePhoto.module.css';

type UploadRecipePhotoProps = {
  onFileSelect: (file: File) => void;
  resetImage: boolean;
  className?: string;
};

const UploadRecipePhoto = ({
  onFileSelect,
  resetImage,
  className,
}: UploadRecipePhotoProps) => {
  // ToDo: dispatch selected image to "recipes" redux store
  // or declare and submit it in the parent component
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedImage = e.target.files[0];
    setImage(selectedImage);
    console.log(selectedImage instanceof File);
    onFileSelect(selectedImage);

    const objectUrl = URL.createObjectURL(selectedImage);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  };

  useEffect(() => {
    setPreview(null);
  }, [resetImage]);

  return (
    <div className={clsx(styles.uploadRecipePhoto, styles[className])}>
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
              <use href={`/images/icons.svg#icon-camera`}></use>
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
