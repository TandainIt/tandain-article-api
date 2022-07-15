import express from 'express';
import 'module-alias/register';


const app = express();
const port = process.env.PORT;

app.use(express.json());
app.set('trust proxy', true);

// ROUTER
app.get('/', (_, res) => {
  res.send('Hello world!')
})

const server = app.listen(port, () => {
	console.log(`Server is running at port ${port}`);
});

export { app, server };
