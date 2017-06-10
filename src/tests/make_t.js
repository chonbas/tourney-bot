var c = require('../webservices/challonge');

c.createTourney('12903812097123'+Date.now().toString(), {
	tournamentType: 'single elimination',
	name: 'automade API tourney '+Date.now().toString(),
})
.then(() => process.exit());
