//require things up here

//eslint-disable-next-line

var errhandle = (msg, tournament_status, channel_type) => {
	return new Promise((fulfill, reject) => {
		//TODO: check states
		//TODO: give helpful error messages
		fulfill(true);
		//fulfill true if everyone's ok and the handlers should run_tourney
		//like green light
		//fulfill false stops handlers from tripping
		reject(/*erros*/);
	});
};

module.exports = errhandle;
