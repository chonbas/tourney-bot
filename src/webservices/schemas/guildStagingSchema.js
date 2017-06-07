'use strict';

var mongoose = require('mongoose');

var staged_tourney_schema = new mongoose.Schema({
	guild_id:{type:String, index:true, unique:true},
	tourney_name:{type:String, default:null},
	tournament_type:{type:String, default:null}, //Use constants
	// teams: {type:Boolean, default:null},
	// signup_cap:{type:Number, default:-1},
	open_signup: {type:Boolean, default:false}
});

var Stage = mongoose.model('Stage', staged_tourney_schema);

module.exports = {'Stage':Stage};