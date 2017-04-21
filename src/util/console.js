/* eslint-disable no-console */
/*/
/* 
Using our own console lets us turn it on/off freely. 
*/
var Console = {};

Console.log = (msg) => {
	console.log(msg);
};

Console.debug = (msg) => {
	console.log(msg);
};

Console.error = (msg) => {
	console.error(msg);
};

module.exports = Console;