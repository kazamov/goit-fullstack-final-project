import Service from './service';

const service = new Service();

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: shutting down');
  service.shutdown();
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: shutting down');
  service.shutdown();
});

service.run();
