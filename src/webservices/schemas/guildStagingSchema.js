'use strict';

var mongoose = require('mongoose');

var staged_tourney_schema = new mongoose.Schema({
	guild_id:{type:String, index:true, unique:true},
	name:{type:String, default:null},
	tournament_type:{type:Number, default:null}, //Use constants
	teams: {type:Boolean, default:null},
	signup_cap:{type:Number, default:null}, //Use constants,//Max users
	start_at:{type:Date, default:null}, //Use constants,
	open_signup: {type:Boolean, default:false}
});

var Stage = mongoose.model('Stage', staged_tourney_schema);

module.exports = {'Stage':Stage};