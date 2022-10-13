const express = require('express');
const path = require('path');

const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
require('dotenv').config({
	path: './server/.env'
});

const { connectDB } = require('./connection');
const routes = require('./routes');

const { verifyToken } = require('./controllers/auth.controller');

const { green, reset } = require('./helpers/console');

const app = express();

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
	allowedHeaders: ['Content-Length', 'Content-Type', 'CSRF', 'JWToken'],
	exposedHeaders: ['CSRF', 'JWToken'],
	origin: 'http://localhost:3010',
}));
app.use(mongoSanitize());

app.use(express.static(path.join(__dirname, '../build')));
app.get('/', (_req, res) => {
	res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.use((req, _res, next) => {
	console.log(`${new Date().toString()} => ${green}${req.method}${reset} ${req.originalUrl}`);
	next();
});

app.use(verifyToken);

app.use(routes());

app.use((_request, response) => response.status(404).json({ name: 'NotFoundError', message: 'Resource Not Found!' }));

const PORT = process.env.PORT ?? 8080;

app.listen(PORT, () => console.info(`Server Has Started on ${green}${PORT}${reset}`));