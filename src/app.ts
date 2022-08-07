import express from 'express';
import 'module-alias/register';

import articleRouter from './article/controller';

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.set('trust proxy', true);

// ROUTER
app.use('/api/v1', articleRouter);

const server = app.listen(port, () => {
	console.log(`Server is running at port ${port}`);
});

export { app, server };
