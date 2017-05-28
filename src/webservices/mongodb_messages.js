var constants = require('../util/constants');
const Console = require('../util/console');
const SCHEMAS = require('./schemas/messageSchema.js');
var Message = SCHEMAS.Message;

var exports = {};


exports.clearDB = () =>{
	return new Promise((fulfill, reject) => {
		Message.remove({}, (err)=>{
			if (err) { reject(err);	}
		});
	});
};

/* createTournament(guild_id)
 * -------------------------------------------------------
 * Takes guild_id and first checks if the guild is already
 * in the db -- if it is, then fulfill with NO_TOURNEY as each
 * guild can only have one active tourney.
 * If no guild found, attempt to create new tourney and set
 * its state to INIT_TOURNEY to start. If an error occurs
 * during creation, the promise is rejected with the error.
 * Returns: Promise -- On succesful fulfill returns CREATE_SUCCESS.
 * Usage:
 * db.createTournament(guild_id).then( (guild_id) =>{
 * 		//DO STUFF
 * }).catch((err)=>{
 * 		//ERROR HANDLING
 * });
 * -------------------------------------------------------
*/
exports.setMessage = (id, type, creator, recipients, payload) => {
	return new Promise((fulfill, reject) => {
		Message.create({
			msg_id: id,
			msg_type: type,
			msg_creator: creator,
			msg_recipients: recipients,
			msg_payload: payload
		}).then( () => {
			Console.log('Message with msg_id:' + id + ' created');
			fulfill(constants.CREATE_SUCCESS);
		}).catch( (err)=>{
			Console.log(err);
			reject(err);
		});
	});
};


exports.getMessage = (id) => {
	return new Promise((fulfill, reject) => {
		Message.findOne({
			msg_id: id
		}).then( (obj) => {
			fulfill(obj);
		}).catch( (err)=>{
			Console.log(err);
			reject(err);
		});
	});
};

module.exports = exports;
