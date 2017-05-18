// eslint-disable-next-line
const Console = require('./util/console');
const constants = require('./util/constants');
// eslint-disable-next-line
const discord = require('./webservices/discord');

if (constants.DEBUG){
	var db_tests = require('./tests/dbTests');
	// db_tests.testTourneyCreation();
	// db_tests.testTourneyChallongeSetGet();
	db_tests.testParticipantCreateGet();
	// db_tests.resetDB();
}