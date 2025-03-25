import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import { CloudinaryClient } from '../infrastructure/cloudinaryClient/cloudinaryClient.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const IMAGES_FOLDER = path.resolve(
  __dirname,
  '../../../frontend/public/images/categories/',
);
const INPUT_JSON_PATH = path.resolve(__dirname, 'data', './categories.json');
const OUTPUT_JSON_PATH = path.resolve(
  __dirname,
  'data',
  './categories-with-images.json',
);
const CLOUDINARY_FOLDER = 'categories';

const imageSuffixMap = {
  '': 'small',
  '@2x': 'medium',
  '@3x': 'large',
  '@4x': 'xlarge',
};

type Suffix = keyof typeof imageSuffixMap;

const getCategoryImageFiles = async (baseName: string) => {
  const files: { suffix: string; filePath: string }[] = [];

  for (const suffix of Object.keys(imageSuffixMap)) {
    const fileName = suffix ? `${baseName}${suffix}.webp` : `${baseName}.webp`;
    const fullPath = path.join(IMAGES_FOLDER, fileName);
    try {
      await fs.access(fullPath);
      files.push({ suffix, filePath: fullPath });
    } catch {
      // file doesn't exist, skip
    }
  }

  return files;
};

const seedCategoryImages = async () => {
  const categoriesData = JSON.parse(
    await fs.readFile(INPUT_JSON_PATH, 'utf-8'),
  );

  const cloudinaryClient = CloudinaryClient.getInstance();

  for (const category of categoriesData) {
    const baseName = category.name;
    const imageFiles = await getCategoryImageFiles(baseName);

    const images: Record<string, string> = {};

    for (const { suffix, filePath } of imageFiles) {
      const content = await fs.readFile(filePath);
      const safeName = suffix
        ? `${baseName}_${suffix.replace('@', '')}`
        : baseName;

      const uploadResult = await cloudinaryClient.uploadFile({
        name: safeName,
        folder: CLOUDINARY_FOLDER,
        content,
      });

      const label = imageSuffixMap[suffix as Suffix];
      images[label] = uploadResult.url;
    }

    category.images = images;
  }

  await fs.writeFile(
    OUTPUT_JSON_PATH,
    JSON.stringify(categoriesData, null, 2),
    'utf-8',
  );
  console.log(`Upload complete. Output written to ${OUTPUT_JSON_PATH}`);
};

export async function runSeedCategoryImagesScript(): Promise<void> {
  try {
    await seedCategoryImages();
  } catch (error) {
    console.error('Error seeding categories images:', error);
  }
}
