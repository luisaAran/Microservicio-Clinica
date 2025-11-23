import app from './app';
import dotenv from 'dotenv';
import { logger } from './utils/logger.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info({ port: PORT }, 'Server running');
    logger.info({ url: `http://localhost:${PORT}/docs` }, 'API docs available');
});
