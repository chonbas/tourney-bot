'use strict';

var mongoose = require('mongoose');

var dispute_schema = new mongoose.Schema({
	originator: String, //discord_id for originator
	defendant: String,
	type: Number,
	additional_info: String,
	resolved: {type:Boolean, default:false}
});

var participant_schema = new mongoose.Schema({
	ids: {
		role_id:{ //Role ID within Discord server -> refs to team
			type: String,
			index: true
		},
		discord_id:{
			type:String,
			index: true
		}
	},
	name: String
});

var team_schema = new mongoose.Schema({
	challonge_id:{type:String, index:true, unique:true}, //identifier
	members:[participant_schema],
	name:String,
	role_id:{ //Role ID within Discord server
		type: String,
		index: true
	},
	owner:String
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
	teams:  [team_schema],
	channels: [channel_schema],
	disputes: [dispute_schema]
});



var Team = mongoose.model('Team', team_schema);
var Guild = mongoose.model('Guild', guild_schema);

module.exports = {'Guild':Guild, 'Team':Team};
