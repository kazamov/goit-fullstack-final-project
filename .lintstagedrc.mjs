function chunkify(array, chunkSize = 10) {
  const chunks = Array.from(
    { length: Math.ceil(array.length / chunkSize) },
    (_, i) => {
      const start = chunkSize * i;
      return array.slice(start, start + chunkSize);
    }
  );
  return chunks;
}

const CHUNK_SIZE = 25;

export default {
  '*.{js,ts,tsx}': 'eslint --fix',
  '*.{html,css,json,js,ts,tsx,mjs}': (allFiles) => {
    const chunks = chunkify(allFiles, CHUNK_SIZE);

    return chunks.map((chunk) => {
      return `prettier --write --list-different ${chunk.join(' ')}`;
    });
  },
};
