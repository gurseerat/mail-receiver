import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import routes from './routes';
import cors from 'cors';
import cookieParser from "cookie-parser";
import dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 3000;
const app: Express = express();
app.use(cookieParser());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

let options: cors.CorsOptions = {
	allowedHeaders: [
		"Origin",
		"X-Requested-With",
		"Content-Type",
		"Accept",
		"X-Access-Token",
		"Authorization",
		"Accept-Encoding",
		"Access-Control-Allow-Origin",
		"Access-Control-Allow-Methods",
		"Access-Control-Allow-Credentials"
	],
	credentials: true,
	methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
	origin: ['http://localhost:8080', 'http://localhost:4200', 'https://616271c1797c58b23bba0508--quirky-aryabhata-12b13a.netlify.app'],
	preflightContinue: false
};
app.use(cors(options));

app.use(routes);

app.get('/', (req: Request, res: Response) => {
	res.send('Welcome to your inbox');
});

app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`));
