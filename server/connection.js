const mongoose = require('mongoose');
const fs = require('fs');

const { reset, green, magenta, red } = require('./helpers/console');

const connectDB = () => {

	const host = process.env.MONGO_HOST
		, port = process.env.MONGO_PORT ?? 27017
		, collection = process.env.MONGO_COLLECTION;

	if (!host || !collection)
		return console.error(`${red}Mongo Configuration Not Found! Can Not Connect To MongoDB.${reset}`);

	const connectionString = `mongodb://${host}:${port}/${collection}`;

	mongoose
		.connect(connectionString, {
			writeConcern: {
				j: true,
			},
		})
		.then(() => {

			if (process.env.NODE_ENV === 'development')
				mongoose.set('debug', true);

			console.log(`${green}Connected To MongoDB.${reset}`);
			mapModels();

		})
		.catch(error => {

			console.error(`${red}Error Connecting To MongoDB.${reset}`);
			console.error(error);

		});

};

const mapModels = () => {

	const modelFiles = fs.readdirSync('./server/models', 'utf-8');

	console.log();

	modelFiles.forEach(modelFile => {

		const modelName = modelFile.split('.')[0];

		console.log(`Model ${green}${modelName}${reset} Mapped To ${magenta}/model/${modelFile}.js${reset}`);

		mongoose.model(modelName, require(`./models/${modelFile}`));

	});

	console.log();

};

module.exports = {
	mongoose,
	connectDB,
};