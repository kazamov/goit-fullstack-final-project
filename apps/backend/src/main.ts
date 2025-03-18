import Service from './service';

const s = new Service();

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: shutting down');
  s.shutdown();
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: shutting down');
  s.shutdown();
});

s.run();
