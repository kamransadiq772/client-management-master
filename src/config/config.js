const useDummyDataObject = {
	development: false,
	test: false,
	production: false,
};

const paginationSizes = [5, 10, 20, 50, 100,];
const apiEndpoint = process.env.REACT_APP_API_ENDPOINT;
const useDummyData = useDummyDataObject[process.env.NODE_ENV];

const config = {
	apiEndpoint,
	paginationSizes,
	useDummyData,
};

export default config;

export {
	apiEndpoint,
	paginationSizes,
	useDummyData,
};