'use strict';

var mongoose = require('mongoose');

var staged_tourney_schema = new mongoose.Schema({
	name:String,
	tournament_type:Number, //Use constants
	ranked_by:Number, //Use constants
	teams: {type:Boolean, default:true},
	signup_cap:Number,//Max users
	start_at:Date,
	open_signup: {type:Boolean, default:false}
});

var Stage = mongoose.model('Stage', staged_tourney_schema);

module.exports = {'Stage':Stage};