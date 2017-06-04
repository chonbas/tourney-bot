'use strict';

var mongoose = require('mongoose');

var staged_tourney_schema = new mongoose.Schema({
	guild_id:{type:String, index:true, unique:true},
	name:{type:String, default:null},
	tournament_type:{type:Number, default:null}, //Use constants
	teams: {type:Boolean, default:null},
	open_signup: {type:Boolean, default:false}
});

var Stage = mongoose.model('Stage', staged_tourney_schema);

module.exports = {'Stage':Stage};