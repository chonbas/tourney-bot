'use strict';

var mongoose = require('mongoose');

var dispute_schema = new mongoose.Schema({
	id : mongoose.Types.ObjectId(),
	originator: String, //discord_id for originator
	defendant: String,
	dispute_type: Number,
	additional_info: String
});

var participant_schema = new mongoose.Schema({
	ids: {
		role_id:{ //Role ID within Discord server
			type: String,
			index: true
		},
		discord_id:{
			type:String,
			index: true,
			unique:true
		},
		challonge_id:{
			type: String,
			index: true
		},
	},
	name: String
});

var team_schema = new mongoose.Schema({
	_id : mongoose.Types.ObjectId(),
	members:[participant_schema],
	name:String,
	role_id:String
});

var channel_schema = new mongoose.Schema({
	channel_type: Number,
	channel_id: {
		type:String,
		index: true,
		unique: true
	},
	ref_id: String //If channel is a match channel, ref_id refers to match id,
						//If channel is jury channel, ref_id refers specific id
});

var chat_state_schema = new mongoose.Schema({
	// This is to be used for NLP purposes
	// to keep track of chat state
	type: mongoose.Schema.Types.Mixed
});


var guild_schema = new mongoose.Schema({
	guild_id: {
		type:String,
		index: true,
		unique: true
	},
	challonge_id: {
		type:String,
		unique: true,
		index: true
	},
	tourney_state: Number, // Tourney state \in {Constants}
	tourney_sub_state: Number, //If tourney is RUNNING, specify cycle state
	teams:  [team_schema],
	channels: [channel_schema],
	chat_state: [chat_state_schema],
	disputes: [dispute_schema]
});

var Guild = mongoose.model('Guild', guild_schema);

module.exports = Guild;
