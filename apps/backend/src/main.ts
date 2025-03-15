import express from 'express';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
  res.status(200).send('Health check');
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
