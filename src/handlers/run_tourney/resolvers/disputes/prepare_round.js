var Console = require('../../../../util/console');
var check_in_resolver = require('../check_in/resolver');
var timer = require('../timer');

var prep = (guild, round) => {
	Console.log('Preparing round ' + round);
	timer.set(guild.id, () => {check_in_resolver(guild, round);});
};

module.exports = prep;
