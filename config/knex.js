module.exports = require("knex")({
	client: "mysql",
	connection: {
		host: 'remotemysql.com',
		user: '9c805RdASc',
		password: '40QnbrZECy',
		database: '9c805RdASc',
		timezone: "IST",
	},
	useNullAsDefault: true,
	acquireConnectionTimeout: 300000,
});