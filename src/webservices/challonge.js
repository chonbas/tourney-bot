const challonge = require('challonge');
const token = require('../../credentials').CHALLONGE_TOKEN;

const client = challonge.createClient({
	apiKey: token
});

module.exports = client;
