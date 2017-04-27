'use strict';

var mongoose = require('mongoose');

var participant_schema = new mongoose.Schema({
  ids: {
            discord_role_id:{ //Role ID within Discord server
                type: String,
                index: true
            },
            challonge_id:{
                type: String,
                index: true
            },
        },
    name: String
});

var channel_schema = new mongoose.Schema({
    channel_type: String,
    channel_id: String,
    reference_id: String //If channel is a match channel, ref_id refers to match id,
                        //If channel is jury chnnale, ref_id refers specific id 
});

var chat_state_schema = new mongoose.Schema({
     // This is to be used for NLP purposes 
     // to keep track of chat state
     type: mongoose.Schema.Types.Mixed
});

var guild_schema = new mongoose.Schema({
    guild_id: String,
    challonge_id: String,
    participants:  [participant_schema],
    channels: [channel_schema],
    chat_state: [chat_state_schema]
});

var Guild = mongoose.model('Guild', guild_schema);

module.exports = Guild;
