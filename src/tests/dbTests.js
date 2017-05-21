var db = require('../webservices/mongodb');
const Console = require('../util/console');
const Constants = require('../util/constants');
const assert = require('assert');

exports = {};

exports.testTourneyCreation = (t_id) => {
    db.createTournament(t_id).then( (status) => {
        Console.log(status);
        return assert.strictEqual(status, Constants.CREATE_SUCCESS);
    }).catch( (err) => {
        Console.log(err);
        return false;
    });
};

exports.testTourneyDeletion = (t_id) => {
    db.deleteTournament(t_id).then( (status) => {
        Console.log(status);
        return assert.strictEqual(status, Constants.REMOVE_SUCCESS);
    }).catch( (err) => {
        Console.log(err);
        return false;
    });
};

exports.testTourneySetChallonge = (t_id, c_id) => {
    db.setTournamentChallongeID(t_id, c_id).then( (status) => {
        Console.log(status);
        return assert.strictEqual(status, Constants.UPDATE_SUCCESS);
    }).catch( (err) => {
        Console.log(err);
        return false;
    });
};

exports.testTourneyGetChallonge = (t_id, c_id) => {
    db.getTournamentChallongeID(t_id).then( (status) => {
        Console.log(status);
        return assert.strictEqual(status, c_id);
    }).catch( (err) => {
        Console.log(err);
        return false;
    });
};

exports.testTourneyGetStatus = (t_id, t_status) => {
    db.getTournamentStatus(t_id).then( (status) => {
        Console.log(status);
        return assert.strictEqual(status, t_status);
    }).catch( (err) => {
        Console.log(err);
        return false;
    });
};

exports.testTourneyGetRunStatus = (t_id, t_status) => {
    db.getTournamentRunState(t_id).then( (status) => {
        Console.log(status);
        return assert.strictEqual(status, t_status);
    }).catch( (err) => {
        Console.log(err);
        return false;
    });
};

exports.testTourneyAdv = (t_id, t_status) => {
    db.advanceTournamentState(t_id).then( (status) => {
        return assert.strictEqual(status, t_status);
    }).catch( (err) => {
        Console.log(err);
        return false;
    });
};

exports.testTourneyAdvRunState = (t_id) => {
    db.advanceTournamentState(t_id).then( (status) => {
        Console.log(status);
        return assert.strictEqual(status, Constants.UPDATE_SUCCESS);
    }).catch( (err) => {
        Console.log(err);
        return false;
    });
};

exports.testTourneyGetTeams = (t_id, role_ids) => {
    db.getTournamentTeams(t_id).then( (teams) => {
        Console.log(teams);
        for (var i = 0; i < role_ids.length; i++){
            if (!assert.strictEqual(teams[i].role_id, role_ids[i])){
                return false;
            }
        }
        return true;
    }).catch( (err) => {
        Console.log(err);
        return false;
    });
};

exports.testTourneyGetParticipants = (t_id, discord_ids) => {
    db.getTournamentTeams(t_id).then( (participants) => {
        Console.log(participants);
        for (var i = 0; i < discord_ids.length; i++){
            if (!assert.strictEqual(participants[i].ids.discord_id, discord_ids[i])){
                return false;
            }
        }
        return true;
    }).catch( (err) => {
        Console.log(err);
        return false;
    });
};

exports.testTourneyGetChannels = (t_id, channel_ids) => {
    db.getTournamentChannels(t_id).then( (channels) => {
        for (var i = 0; i < channel_ids.length; i++){
            if (!assert.strictEqual(channels[i].channel_id, channel_ids[i])){
                return false;
            }
        }
        return true;
    }).catch( (err) => {
        Console.log(err);
        return false;
    });
};

exports.testTourneyGetDisputes = (t_id, dispute_def_ori) => {
    db.getTournamentDisputes(t_id).then( (disputes) => {
        for (var i = 0; i < dispute_def_ori.length; i++){
            if (!assert.strictEqual(disputes[i].originator, dispute_def_ori[i].originator)){
                return false;
            }
            if (!assert.strictEqual(disputes[i].defendant, dispute_def_ori[i].defendant)){
                return false;
            }
        }
        return true;
    }).catch( (err) => {
        Console.log(err);
        return false;
    });
};

exports.testCreateTeam = (t_id, role_id, name) => {
    db.createTeam(t_id, role_id, name).then( (status) => {
        Console.log(status);
        return status;
    }).catch( (err) => {
        Console.log(err);
        return false;
    });
};

exports.testRemoveTeam = (t_id, role_id, t_status) => {
    db.removeTeam(t_id, role_id).then( (status) => {
        Console.log(status);
        return assert.strictEqual(status, t_status);
    }).catch( (err) => {
        Console.log(err);
        return false;
    });
};

exports.testGetTeamIDByRoleID = (t_id, r_id, t_status) => {
    db.getTeamIDByRoleID(t_id, r_id).then( (status) => {
        Console.log(status);
        return assert.strictEqual(status, t_status);
    }).catch( (err) => {
        Console.log(err);
        return false;
    });
};

exports.testGetTeamIDByName = (t_id, name, t_status) => {
    db.getTeamIDByName(t_id, name).then( (status) => {
        Console.log(status);
        return assert.strictEqual(status, t_status);
    }).catch( (err) => {
        Console.log(err);
        return false;
    });
};

exports.testGetTeamCreatorByTeamID = (t_id, tm_id, t_status) => {
    db.getTeamCreatorByTeamID(t_id, tm_id).then( (status) => {
        return assert.strictEqual(status, t_status);
    }).catch( (err) => {
        Console.log(err);
        return false;
    });
};

exports.testGetTeamCreatorByRoleID = (t_id, r_id, t_status) => {
    db.getTeamCreatorByRoleID(t_id, r_id).then( (status) => {
        return assert.strictEqual(status, t_status);
    }).catch( (err) => {
        Console.log(err);
        return false;
    });
};

exports.testSetTeamChallongeID = (t_id, tm_id, c_id, t_status) => {
    db.setTeamChallongeID(t_id, tm_id, c_id).then( (status) => {
        Console.log(status);
        return assert.strictEqual(status, t_status);
    }).catch( (err) => {
        Console.log(err);
        return false;
    });
};

exports.testGetTeamChallongeID = (t_id, tm_id, t_status) => {
    db.getTeamChallongeID(t_id, tm_id).then( (status) => {
        Console.log(status);
        return assert.strictEqual(status, t_status);
    }).catch( (err) => {
        Console.log(err);
        return false;
    });
};

exports.testSetTeamRoleID = (t_id, tm_id, r_id, t_status) => {
    db.setTeamRoleID(t_id, tm_id, r_id).then( (status) => {
        Console.log(status);
        return assert.strictEqual(status, t_status);
    }).catch( (err) => {
        Console.log(err);
        return false;
    });
};

exports.testGetTeamRoleID = (t_id, tm_id, t_status) => {
    db.getTeamRoleID(t_id, tm_id).then( (status) => {
        Console.log(status);
        return assert.strictEqual(status, t_status);
    }).catch( (err) => {
        Console.log(err);
        return false;
    });
};

exports.testCreateParticipant = (t_id, name, d_id, tm_id, t_status) => {
    db.createParticipant(t_id, name, d_id, tm_id).then( (status) => {
        return assert.strictEqual(status, t_status);
    }).catch( (err) => {
        Console.log(err);
        return false;
    });
};

exports.testRemoveParticipant = (t_id, d_id, t_status) => {
    db.removeParticipant(t_id, d_id).then( (status) => {
        return assert.strictEqual(status, t_status);
    }).catch( (err) => {
        Console.log(err);
        return false;
    });
};

exports.testGetParticipantDiscordID = (t_id, name, t_status) => {
    db.getParticipantDiscordID(t_id, name).then( (status) => {
        return assert.strictEqual(status, t_status);
    }).catch( (err) => {
        Console.log(err);
        return false;
    });
};

exports.testGetParticipantTeamID = (t_id, d_id, t_status) => {
    db.getParticipantTeamID(t_id, d_id).then( (status) => {
        return assert.strictEqual(status, t_status);
    }).catch( (err) => {
        Console.log(err);
        return false;
    });
};

exports.testCreateDispute = (t_id, o_id, d_id, d_type, add_info,  t_status) => {
    db.createDispute(t_id, o_id, d_id, d_type, add_info).then( (status) => {
        return assert.strictEqual(status, t_status);
    }).catch( (err) => {
        Console.log(err);
        return false;
    });
};

exports.testResolveDispute = (t_id, d_id, t_status) => {
    db.resolveDispute(t_id, d_id).then( (status) => {
        return assert.strictEqual(status, t_status);
    }).catch( (err) => {
        Console.log(err);
        return false;
    });
};

exports.testResolveDisputesByType = (t_id, d_type, t_status) => {
    db.resolveDisputesByType(t_id, d_type).then( (status) => {
        return assert.strictEqual(status, t_status);
    }).catch( (err) => {
        Console.log(err);
        return false;
    });
};

exports.testGetDisputeID = (t_id, def_id, t_status) => {
    db.getDisputeID(t_id, def_id).then( (status) => {
        return assert.strictEqual(status, t_status);
    }).catch( (err) => {
        Console.log(err);
        return false;
    });
};

exports.testGetDisputeByID = (t_id, d_id, t_status) => {
    db.getDisputeByID(t_id, d_id).then( (status) => {
        if (t_status.length > 0){
            return assert.strictEqual(status, t_status);
        } else {
            return assert.strictEqual(status._id, d_id);
        }
    }).catch( (err) => {
        Console.log(err);
        return false;
    });
};

exports.testCreateChannel = (t_id, c_id, c_type, ref_id,  t_status) => {
    db.createChannel(t_id, c_id, c_type, ref_id).then( (status) => {
        return assert.strictEqual(status, t_status);
    }).catch( (err) => {
        Console.log(err);
        return false;
    });
};

exports.testDeleteChannel = (t_id, c_id, t_status) => {
    db.deleteChannel(t_id, c_id).then( (status) => {
        return assert.strictEqual(status, t_status);
    }).catch( (err) => {
        Console.log(err);
        return false;
    });
};

exports.testGetChannelType = (t_id, c_id, t_status) => {
    db.getChannelType(t_id, c_id).then( (status) => {
        return assert.strictEqual(status, t_status);
    }).catch( (err) => {
        Console.log(err);
        return false;
    });
};

exports.testDeleteChannelsByType = (t_id, c_type, t_status) => {
    db.deleteChannelsByType(t_id, c_type).then( (status) => {
        return assert.strictEqual(status, t_status);
    }).catch( (err) => {
        Console.log(err);
        return false;
    });
};


/* -------------------------------------------------------------------
 * -------------------------------------------------------------------
 * -------------------------------------------------------------------
 * -------------------------------------------------------------------
 * -------------------------------------------------------------------
 * -------------------------------------------------------------------
 */
var testFailed = (msg) => {
    Console.log('Test Failed ---- ' + msg);
    // process.exit();
};
var printTestName = (msg) => {
    Console.log('----------------------------------------------------');
    Console.log('---------------Testing '+ msg + ' -------------');
    return msg;
};

exports.runDBTests = () => {
    return new Promise((fulfill, reject) => {
        var t_id = '1234';
        var c_id = 'c1234';
        var cur_test = printTestName('Tourney Creation');
        if (!exports.testTourneyCreation(t_id)){
            testFailed(cur_test);
        };
        cur_test = printTestName('Tourney Deletion');
        if (!exports.testTourneyDeletion(t_id)){
            testFailed(cur_test);
        };
        cur_test = printTestName('Tourney Properties Get/Set');
        if (!exports.testTourneyCreation(t_id)){;
            testFailed(cur_test)
        };
        cur_test = printTestName('Tourney Set Challonge');
        if (!exports.testTourneySetChallonge(t_id, c_id)){
            testFailed(cur_test);
        };
        cur_test = printTestName('Tourney Get Challonge');
        if (!exports.testTourneyGetChallonge(t_id, c_id)){
            testFailed(cur_test);
        };
        cur_test = printTestName('Tourney Get Status');
        if(!exports.testTourneyGetStatus(t_id, Constants.INIT_TOURNEY)){
            testFailed(cur_test);
        };
        cur_test = printTestName('Tourney Get Status 2');
        if(!exports.testTourneyGetStatus('0', Constants.NO_TOURNEY)){
            testFailed(cur_test);
        };
        cur_test = printTestName('Tourney Advance Status 1');
        if(!exports.testTourneyAdv(t_id, Constants.UPDATE_SUCCESS)){
            testFailed(cur_test);
        };
        cur_test = printTestName('Tourney Advance Status 2');
        if(!exports.testTourneyAdv('0', Constants.NO_TOURNEY)){
            testFailed(cur_test);
        };
        cur_test = printTestName('Tourney Get Run Status 1');
        if(!exports.testTourneyGetRunStatus(t_id, null)){
            testFailed(cur_test);
        };
        cur_test = printTestName('Tourney Advance Status 3');
        if(!exports.testTourneyAdv(t_id, Constants.UPDATE_SUCCESS)){
            testFailed(cur_test);
        };
        for (var i = 0; i <  4; i++) {
            cur_test = printTestName('Tourney Get Run Status ' + (i+2));
            var cur_state = Constants.STATE_MATCH + i;
            if(!exports.testTourneyGetRunStatus(t_id, cur_state)){
                testFailed(cur_test);
            };
            cur_test = printTestName('Tourney Adv Run State ' + i);
        }
        cur_test = printTestName('Tourney Get Run Status 6');
        if(!exports.testTourneyGetRunStatus(t_id, Constants.STATE_MATCH)){
            testFailed(cur_test);
        };
        var role_ids = [];
        var team_ids = [];
        for (var i = 0; i < 4; i++){
            cur_test = printTestName('Tourney Team Creation ' + i);
            var role = 'r_' + i;
            role_ids.push(role);
            var name = 'n_' + i;
            var tm_id = exports.testCreateTeam(t_id, role, name);
            if (tm_id === false){
                testFailed(cur_test);
            }
            team_ids.push(tm_id);

            cur_test = printTestName('Get Team ID By Role ID ' + i);
            if (!exports.testGetTeamIDByRoleID(t_id, role, tm_id)){
                testFailed(cur_test);
            }
            cur_test = printTestName('Get Team ID By Name ' + i);
            if (!exports.testGetTeamIDByName(t_id, name, tm_id)){
                testFailed(cur_test);
            }
        }
        cur_test = printTestName('Tourney Get Teams');
        if (!exports.testTourneyGetTeams(t_id, role_ids)){
            testFailed(cur_test);
        };
        var chall_ids = []
        for (var i = 0; i < 4; i++){
            cur_test = printTestName('Team Set Challonge ID ' + i);
            var chall_id = 'C_' + i;
            if (!exports.testSetTeamChallongeID(t_id, team_ids[i], chall_id, Constants.UPDATE_SUCCESS)){
                testFailed(cur_test);
            };
            chall_ids.push(chall_id);
        }
        for (var i = 0; i < 4; i++){
            cur_test = printTestName('Team Get Challonge ID ' + i);
            var chall_id = chall_ids[i];
            if (!exports.testGetTeamChallongeID(t_id, team_ids[i], chall_id)){
                testFailed(cur_test);
            };
        }
        fulfill();
        reject();
    });



// exports.testSetTeamRoleID = (t_id, tm_id, r_id, t_status) => {
//     db.setTeamRoleID(t_id, tm_id, r_id).then( (status) => {
//         return assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         return false;
//     });
// };

// exports.testGetTeamRoleID = (t_id, tm_id, t_status) => {
//     db.getTeamRoleID(t_id, tm_id).then( (status) => {
//         return assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         return false;
//     });
// };

// exports.testTourneyGetParticipants = (t_id, discord_ids) => {
//     db.getTournamentTeams(t_id).then( (participants) => {
//         for (var i = 0; i < discord_ids.length; i++){
//             if (!assert.strictEqual(participants[i].ids.discord_id, discord_ids[i])){
//                 return false;
//             }
//         }
//         return true;
//     }).catch( (err) => {
//         Console.log(err);
//         return false;
//     });
// };

// exports.testTourneyGetChannels = (t_id, channel_ids) => {
//     db.getTournamentChannels(t_id).then( (channels) => {
//         for (var i = 0; i < channel_ids.length; i++){
//             if (!assert.strictEqual(channels[i].channel_id, channel_ids[i])){
//                 return false;
//             }
//         }
//         return true;
//     }).catch( (err) => {
//         Console.log(err);
//         return false;
//     });
// };

// exports.testTourneyGetDisputes = (t_id, dispute_def_ori) => {
//     db.getTournamentDisputes(t_id).then( (disputes) => {
//         for (var i = 0; i < dispute_def_ori.length; i++){
//             if (!assert.strictEqual(disputes[i].originator, dispute_def_ori[i].originator)){
//                 return false;
//             }
//             if (!assert.strictEqual(disputes[i].defendant, dispute_def_ori[i].defendant)){
//                 return false;
//             }
//         }
//         return true;
//     }).catch( (err) => {
//         Console.log(err);
//         return false;
//     });
// };



// exports.testRemoveTeam = (t_id, role_id, t_status) => {
//     db.removeTeam(t_id, role_id).then( (status) => {
//         return assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         return false;
//     });
// };



// exports.testGetTeamCreatorByTeamID = (t_id, tm_id, t_status) => {
//     db.getTeamCreatorByTeamID(t_id, tm_id).then( (status) => {
//         return assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         return false;
//     });
// };

// exports.testGetTeamCreatorByRoleID = (t_id, r_id, t_status) => {
//     db.getTeamCreatorByRoleID(t_id, r_id).then( (status) => {
//         return assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         return false;
//     });
// };

// exports.testSetTeamChallongeID = (t_id, tm_id, c_id, t_status) => {
//     db.setTeamChallongeID(t_id, tm_id, c_id).then( (status) => {
//         return assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         return false;
//     });
// };

// exports.testGetTeamChallongeID = (t_id, tm_id, t_status) => {
//     db.getTeamChallongeID(t_id, tm_id).then( (status) => {
//         return assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         return false;
//     });
// };

// exports.testSetTeamRoleID = (t_id, tm_id, r_id, t_status) => {
//     db.setTeamRoleID(t_id, tm_id, r_id).then( (status) => {
//         return assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         return false;
//     });
// };

// exports.testGetTeamRoleID = (t_id, tm_id, t_status) => {
//     db.getTeamRoleID(t_id, tm_id).then( (status) => {
//         return assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         return false;
//     });
// };

// exports.testCreateParticipant = (t_id, name, d_id, tm_id, t_status) => {
//     db.createParticipant(t_id, name, d_id, tm_id).then( (status) => {
//         return assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         return false;
//     });
// };

// exports.testRemoveParticipant = (t_id, d_id, t_status) => {
//     db.removeParticipant(t_id, d_id).then( (status) => {
//         return assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         return false;
//     });
// };

// exports.testGetParticipantDiscordID = (t_id, name, t_status) => {
//     db.getParticipantDiscordID(t_id, name).then( (status) => {
//         return assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         return false;
//     });
// };

// exports.testGetParticipantTeamID = (t_id, d_id, t_status) => {
//     db.getParticipantTeamID(t_id, d_id).then( (status) => {
//         return assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         return false;
//     });
// };

// exports.testCreateDispute = (t_id, o_id, d_id, d_type, add_info,  t_status) => {
//     db.createDispute(t_id, o_id, d_id, d_type, add_info).then( (status) => {
//         return assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         return false;
//     });
// };

// exports.testResolveDispute = (t_id, d_id, t_status) => {
//     db.resolveDispute(t_id, d_id).then( (status) => {
//         return assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         return false;
//     });
// };

// exports.testResolveDisputesByType = (t_id, d_type, t_status) => {
//     db.resolveDisputesByType(t_id, d_type).then( (status) => {
//         return assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         return false;
//     });
// };

// exports.testGetDisputeID = (t_id, def_id, t_status) => {
//     db.getDisputeID(t_id, def_id).then( (status) => {
//         return assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         return false;
//     });
// };

// exports.testGetDisputeByID = (t_id, d_id, t_status) => {
//     db.getDisputeByID(t_id, d_id).then( (status) => {
//         if (t_status.length > 0){
//             return assert.strictEqual(status, t_status);
//         } else {
//             return assert.strictEqual(status._id, d_id);
//         }
//     }).catch( (err) => {
//         Console.log(err);
//         return false;
//     });
// };

// exports.testCreateChannel = (t_id, c_id, c_type, ref_id,  t_status) => {
//     db.createChannel(t_id, c_id, c_type, ref_id).then( (status) => {
//         return assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         return false;
//     });
// };

// exports.testDeleteChannel = (t_id, c_id, t_status) => {
//     db.deleteChannel(t_id, c_id).then( (status) => {
//         return assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         return false;
//     });
// };

// exports.testGetChannelType = (t_id, c_id, t_status) => {
//     db.getChannelType(t_id, c_id).then( (status) => {
//         return assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         return false;
//     });
// };

// exports.testDeleteChannelsByType = (t_id, c_type, t_status) => {
//     db.deleteChannelsByType(t_id, c_type).then( (status) => {
//         return assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         return false;
//     });
// };
};

module.exports = exports;

if (!module.parent) {
	exports.runDBTests().then( () => {
        Console.log('tut');
        process.exit();
    });
}