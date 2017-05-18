// const Console = require('./src/util/console');

//check that credentials file exists

// eslint-disable-next-line
var credentials;
try {
    // eslint-disable-next-line
	credentials = require('./credentials.js');
} catch (err) {
	//Console.log('You must provide a credentials file with API tokens, etc.');
	process.exit();
}

require('./src/');