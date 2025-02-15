import ffy, { setupServer } from './src';

const startServer = async (): Promise<void> => {
  try {
    await setupServer();

    const port = Number.parseInt('3000', 10);
    await ffy.listen({ port, host: '0.0.0.0' });
    ffy.log.info(`Server listening on port ${port}`);
  } catch (err) {
    ffy.log.error(err);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

export { ffy };
