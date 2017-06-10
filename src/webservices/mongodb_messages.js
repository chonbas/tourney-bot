var constants = require('../util/constants');
const Console = require('../util/console');
const SCHEMAS = require('./schemas/messageSchema.js');
var Message = SCHEMAS.Message;

var exports = {};


exports.clearDB = () =>{
	return new Promise((fulfill, reject) => {
		Message.remove({}, (err)=>{
			if (err) { reject(err);	}
			fulfill();
		});
	});
};

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

exports.deleteMessage = (id) => {
	return new Promise((fulfill, reject) => {
		Message.remove({
			msg_id: id
		}, (err)=>{
			if (err) { reject(err);	}
			fulfill(constants.REMOVE_SUCCESS);
		});
	});
};

module.exports = exports;
