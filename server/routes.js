const express = require('express');
const fs = require('fs');
const { pluralize: getPluralize } = require('mongoose');
const pluralize = getPluralize();

const router = express.Router();

const { green, reset, magenta, red } = require('./helpers/console');

const mapRoutes = () => {

	const routeList = fs.readdirSync('./server/routes', { encoding: 'utf-8', });

	console.log();

	const routeMap = routeList.map(route => {

		const routeFileName = route.split('.')[0]
			, routeName = routeFileName !== 'auth' ? pluralize(routeFileName) : routeFileName
			, routeFile = route.replace('.js', '');

		console.log(`Route ${green}/${routeName}${reset} Mapped To ${magenta}/routes/${routeFile}.js${reset}`);

		return router.use(`/${routeName}`, require(`./routes/${routeFile}`));

	});

	if (routeMap.length === 0) {
		console.error(`${red}No Routes File Found in /routes!${reset}`)
		return null;
	};

	console.log();

	return routeMap;

};

module.exports = mapRoutes;
