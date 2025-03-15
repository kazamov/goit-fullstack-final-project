import express from 'express';
import cors from 'cors';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? '*',
  })
);

app.get('/', (_req, res) => {
  res.status(200).send('Health check');
});

app.get('/api/data', (_req, res) => {
  res.status(200).json({ message: 'Hello from the backend!' });
});

app.post('/api/data', (req, res) => {
  res.status(200).json(req.body);
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
});
