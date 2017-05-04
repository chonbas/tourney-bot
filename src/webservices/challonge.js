const challonge = require('challonge');

const token = require('../../credentials').CHALLONGE_TOKEN;

const client = challonge.createClient({
	apiKey: "OTt7J6rYLgefYbCPd6XR180z14r1Pu3ySYN6uY7F"
});

module.exports = client;

client.tournaments.create({
  tournament: {
    name: 'new_tournament_name',
    url: 'new_tournament_url',
    tournamentType: 'single elimination',
  },
  callback: (err, data) => {
    console.log(err, data);
  }
});