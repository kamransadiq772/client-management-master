module.exports = {
	apps: [
		{
			script: 'serve',
			name: 'GulAhmedFrontend',
			env: {
				PM2_SERVE_PATH: 'build',
				PM2_SERVE_PORT: 5000,
				PM2_SERVE_SPA: 'true',
				PM2_SERVE_HOMEPAGE: '/index.html',
			}
		}
	]
}