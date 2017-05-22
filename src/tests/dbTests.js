var db = require('../webservices/mongodb');
const Console = require('../util/console');
const Constants = require('../util/constants');
const wipeDB = require('../util/wipeDB');
const assert = require('assert');

exports = {};

var testTourneyCreation = (t_id) => {
	return new Promise( (fulfill, reject) =>{
		db.createTournament(t_id).then( (status) => {
			assert.strictEqual(status, Constants.CREATE_SUCCESS);
			fulfill(true);
		}).catch( (err) => {
			Console.log(err);
			reject(false);
		});
	});
};

var testTourneyDeletion = (t_id) => {
	return new Promise( (fulfill, reject) =>{
		db.deleteTournament(t_id).then( (status) => {
			assert.strictEqual(status, Constants.REMOVE_SUCCESS);
			fulfill(true);
		}).catch( (err) => {
			Console.log(err);
			reject(false);
		});
	});
};

var testTourneySetChallonge = (t_id, c_id) => {
	return new Promise( (fulfill, reject) =>{
		db.setTournamentChallongeID(t_id, c_id).then( (status) => {
			assert.strictEqual(status, Constants.UPDATE_SUCCESS);
			fulfill(true);
		}).catch( (err) => {
			Console.log(err);
			reject(false);
		});
	});
};

var testTourneyGetChallonge = (t_id, c_id) => {
	return new Promise( (fulfill, reject) =>{
		db.getTournamentChallongeID(t_id).then( (status) => {
			assert.strictEqual(status, c_id);
			fulfill(true);
		}).catch( (err) => {
			Console.log(err);
			reject(false);
		});
	});
};

var testTourneyGetStatus = (t_id, t_status) => {
	return new Promise( (fulfill, reject) =>{
		db.getTournamentStatus(t_id).then( (status) => {
			assert.strictEqual(status, t_status);
			fulfill(true);
		}).catch( (err) => {
			Console.log(err);
			reject(false);
		});
	});
};

var testTourneyGetRunStatus = (t_id, t_status) => {
	return new Promise( (fulfill, reject) =>{
		db.getTournamentRunState(t_id).then( (status) => {
			assert.strictEqual(status, t_status);
			fulfill(true);
		}).catch( (err) => {
			Console.log(err);
			reject(false);
		});
	});
};

var testTourneyAdv = (t_id, t_status) => {
	return new Promise( (fulfill, reject) =>{
		db.advanceTournamentState(t_id).then( (status) => {
			assert.strictEqual(status, t_status);
			fulfill(true);
		}).catch( (err) => {
			Console.log(err);
			reject(false);
		});
	});
};

var testTourneyAdvRunState = (t_id) => {
	return new Promise( (fulfill, reject) =>{
		db.advanceTournamentRunState(t_id).then( (status) => {
			assert.strictEqual(status, Constants.UPDATE_SUCCESS);
			fulfill(true);
		}).catch( (err) => {
			Console.log(err);
			reject(false);
		});
	});
};

var testTourneyGetTeams = (t_id, role_ids) => {
	return new Promise( (fulfill, reject) =>{
		db.getTournamentTeams(t_id).then( (teams) => {
			for (var i = 0; i < role_ids.length; i++){
				assert.strictEqual(teams[i].role_id, role_ids[i]);
			}
			fulfill(true);
		}).catch( (err) => {
			Console.log(err);
			reject(false);
		});
	});
};

var testTourneyGetParticipants = (t_id, discord_ids) => {
	return new Promise( (fulfill, reject) =>{
		db.getTournamentTeams(t_id).then( (participants) => {
			for (var i = 0; i < discord_ids.length; i++){
				assert.strictEqual(participants[i].ids.discord_id, discord_ids[i]);
			}
			fulfill(true);
		}).catch( (err) => {
			Console.log(err);
			reject(false);
		});
	});
};

var testTourneyGetChannels = (t_id, channel_ids) => {
	return new Promise( (fulfill, reject) =>{
		db.getTournamentChannels(t_id).then( (channels) => {
			for (var i = 0; i < channel_ids.length; i++){
				assert.strictEqual(channels[i].channel_id, channel_ids[i]);
			}
			fulfill(true);
		}).catch( (err) => {
			Console.log(err);
			reject(false);
		});
	});
};

var testTourneyGetDisputes = (t_id, dispute_def_ori) => {
	return new Promise( (fulfill, reject) =>{
		db.getTournamentDisputes(t_id).then( (disputes) => {
			for (var i = 0; i < dispute_def_ori.length; i++){
				assert.strictEqual(disputes[i].originator, dispute_def_ori[i].originator);
				assert.strictEqual(disputes[i].defendant, dispute_def_ori[i].defendant);
			}
			fulfill(true);
		}).catch( (err) => {
			Console.log(err);
			reject(false);
		});
	});
};

var testCreateTeam = (t_id, role_id, name) => {
	return new Promise( (fulfill, reject) =>{
		db.createTeam(t_id, role_id, name).then( (status) => {
			fulfill(status);
		}).catch( (err) => {
			Console.log(err);
			reject(false);
		});
	});
};

var testRemoveTeam = (t_id, role_id, t_status) => {
	return new Promise( (fulfill, reject) =>{
		db.removeTeam(t_id, role_id).then( (status) => {
			assert.strictEqual(status, t_status);
			fulfill(true);
		}).catch( (err) => {
			Console.log(err);
			reject(false);
		});
	});
};

var testGetTeamIDByRoleID = (t_id, r_id) => {
	return new Promise( (fulfill, reject) =>{
		db.getTeamIDByRoleID(t_id, r_id).then( () => {
			fulfill(true);
		}).catch( (err) => {
			Console.log(err);
			reject(false);
		});
	});
};

var testGetTeamIDByName = (t_id, name) => {
	return new Promise( (fulfill, reject) =>{
		db.getTeamIDByName(t_id, name).then( () => {
			fulfill(true);
		}).catch( (err) => {
			Console.log(err);
			reject(false);
		});
	});
};

var testGetTeamCreatorByTeamID = (t_id, tm_id, t_status) => {
	return new Promise( (fulfill, reject) =>{
		db.getTeamCreatorByTeamID(t_id, tm_id).then( (status) => {
			assert.strictEqual(status, t_status);
			fulfill(true);
		}).catch( (err) => {
			Console.log(err);
			reject(false);
		});
	});
};

var testGetTeamCreatorByRoleID = (t_id, r_id, t_status) => {
	return new Promise( (fulfill, reject) =>{
		db.getTeamCreatorByRoleID(t_id, r_id).then( (status) => {
			assert.strictEqual(status, t_status);
			fulfill(true);
		}).catch( (err) => {
			Console.log(err);
			reject(false);
		});
	});
};

var testSetTeamChallongeID = (t_id, tm_id, c_id, t_status) => {
	return new Promise( (fulfill, reject) =>{
		db.setTeamChallongeID(t_id, tm_id, c_id).then( (status) => {
			assert.strictEqual(status, t_status);
			fulfill(true);
		}).catch( (err) => {
			Console.log(err);
			reject(false);
		});
	});
};

var testGetTeamChallongeID = (t_id, tm_id, t_status) => {
	return new Promise( (fulfill, reject) =>{
		db.getTeamChallongeID(t_id, tm_id).then( (status) => {
			assert.strictEqual(status, t_status);
			fulfill(true);
		}).catch( (err) => {
			Console.log(err);
			reject(false);
		});
	});
};

var testSetTeamRoleID = (t_id, tm_id, r_id, t_status) => {
	return new Promise( (fulfill, reject) =>{
		db.setTeamRoleID(t_id, tm_id, r_id).then( (status) => {
			assert.strictEqual(status, t_status);
			fulfill(true);
		}).catch( (err) => {
			Console.log(err);
			reject(false);
		});
	});
};

var testGetTeamRoleID = (t_id, tm_id, t_status) => {
	return new Promise( (fulfill, reject) =>{
		db.getTeamRoleID(t_id, tm_id).then( (status) => {
			assert.strictEqual(status, t_status);
			fulfill(true);
		}).catch( (err) => {
			Console.log(err);
			reject(false);
		});
	});
};

var testCreateParticipant = (t_id, name, d_id, tm_id, t_status) => {
	return new Promise( (fulfill, reject) =>{
		db.createParticipant(t_id, name, d_id, tm_id).then( (status) => {
			assert.strictEqual(status, t_status);
			fulfill(true);
		}).catch( (err) => {
			Console.log(err);
			reject(false);
		});
	});
};

var testRemoveParticipant = (t_id, d_id, t_status) => {
	return new Promise( (fulfill, reject) =>{
		db.removeParticipant(t_id, d_id).then( (status) => {
			assert.strictEqual(status, t_status);
			fulfill(true);
		}).catch( (err) => {
			Console.log(err);
			reject(false);
		});
	});
};

var testGetParticipantDiscordID = (t_id, name, t_status) => {
	return new Promise( (fulfill, reject) =>{
		db.getParticipantDiscordID(t_id, name).then( (status) => {
			assert.strictEqual(status, t_status);
			fulfill(true);
		}).catch( (err) => {
			Console.log(err);
			reject(false);
		});
	});
};

var testGetParticipantTeamID = (t_id, d_id, t_status) => {
	return new Promise( (fulfill, reject) =>{
		db.getParticipantTeamID(t_id, d_id).then( (status) => {
			assert.strictEqual(status, t_status);
			fulfill(true);
		}).catch( (err) => {
			Console.log(err);
			reject(false);
		});
	});
};

var testCreateDispute = (t_id, o_id, d_id, d_type, add_info,  t_status) => {
	return new Promise( (fulfill, reject) =>{
		db.createDispute(t_id, o_id, d_id, d_type, add_info).then( (status) => {
			assert.strictEqual(status, t_status);
			fulfill(true);
		}).catch( (err) => {
			Console.log(err);
			reject(false);
		});
	});
};

var testResolveDispute = (t_id, d_id, t_status) => {
	return new Promise( (fulfill, reject) =>{
		db.resolveDispute(t_id, d_id).then( (status) => {
			assert.strictEqual(status, t_status);
			fulfill(true);
		}).catch( (err) => {
			Console.log(err);
			reject(false);
		});
	});
};

var testResolveDisputesByType = (t_id, d_type, t_status) => {
	return new Promise( (fulfill, reject) =>{
		db.resolveDisputesByType(t_id, d_type).then( (status) => {
			assert.strictEqual(status, t_status);
			fulfill(true);
		}).catch( (err) => {
			Console.log(err);
			reject(false);
		});
	});
};

var testGetDisputeID = (t_id, def_id, t_status) => {
	return new Promise( (fulfill, reject) =>{
		db.getDisputeID(t_id, def_id).then( (status) => {
			assert.strictEqual(status, t_status);
			fulfill(true);
		}).catch( (err) => {
			Console.log(err);
			reject(false);
		});
	});
};

var testGetDisputeByID = (t_id, d_id, t_status) => {
	return new Promise( (fulfill, reject) =>{
		db.getDisputeByID(t_id, d_id).then( (status) => {
			if (t_status.length > 0){
				assert.strictEqual(status, t_status);
			} else {
				assert.strictEqual(status._id, d_id);
			}
			fulfill(true);
		}).catch( (err) => {
			Console.log(err);
			reject(false);
		});
	});
};

var testCreateChannel = (t_id, c_id, c_type, ref_id,  t_status) => {
	return new Promise( (fulfill, reject) =>{
		db.createChannel(t_id, c_id, c_type, ref_id).then( (status) => {
			assert.strictEqual(status, t_status);
			fulfill(true);
		}).catch( (err) => {
			Console.log(err);
			reject(false);
		});
	});
};

var testDeleteChannel = (t_id, c_id, t_status) => {
	return new Promise( (fulfill, reject) =>{
		db.deleteChannel(t_id, c_id).then( (status) => {
			assert.strictEqual(status, t_status);
			fulfill(true);
		}).catch( (err) => {
			Console.log(err);
			reject(false);
		});
	});
};

var testGetChannelType = (t_id, c_id, t_status) => {
	return new Promise( (fulfill, reject) =>{
		db.getChannelType(t_id, c_id).then( (status) => {
			assert.strictEqual(status, t_status);
			fulfill(true);
		}).catch( (err) => {
			Console.log(err);
			reject(false);
		});
	});
};

var testDeleteChannelsByType = (t_id, c_type, t_status) => {
	return new Promise( (fulfill, reject) =>{
		db.deleteChannelsByType(t_id, c_type).then( (status) => {
			assert.strictEqual(status, t_status);
			fulfill(true);
		}).catch( (err) => {
			Console.log(err);
			reject(false);
		});
	});
};


/* -------------------------------------------------------------------
 * -------------------------------------------------------------------
 * -------------------------------------------------------------------
 * -------------------------------------------------------------------
 * -------------------------------------------------------------------
 * -------------------------------------------------------------------
 */
var testFailed = (reject, msg, err) => {
	Console.log('Test Failed ---- ' + msg);
	Console.log(err);
	wipeDB().then( () => {
		process.exit();
	});
};
var printTestName = (msg) => {
	Console.log('----------------------------------------------------');
	Console.log('---------------Testing '+ msg + ' -------------');
	return msg;
};



var runTourneyCreateDeleteTest = (t_id) => {
	return new Promise((fulfill, reject) => {
		var cur_test = printTestName('Tourney Creation');
		testTourneyCreation(t_id).then( (result) => {
			Console.log(result);
			cur_test = printTestName('Tourney Deletion');
			testTourneyDeletion(t_id).then( (result) => {
				Console.log(result);
				fulfill(true);
			}).catch( (err) =>{
				testFailed(reject, cur_test, err);
			});
		}).catch( (err) => {
			testFailed(reject, cur_test, err);
		});
	});
};

var runTourneyPropertiesGetSetTest = (t_id, c_id) => {
	return new Promise((fulfill, reject) => {
		var cur_test = printTestName('Tourney Properties Get/Set');
		testTourneyCreation(t_id).then( (result) => {
			Console.log(result);
			cur_test = printTestName('Tourney Set Challonge');
			testTourneySetChallonge(t_id, c_id).then( (result) => {
				Console.log(result);
				cur_test = printTestName('Tourney Get Challonge');
				testTourneyGetChallonge(t_id, c_id).then( (result) => {
					Console.log(result);
					cur_test = printTestName('Tourney Get Status');
					testTourneyGetStatus(t_id, Constants.INIT_TOURNEY).then( (result) => {
						Console.log(result);
						cur_test = printTestName('Tourney Get Status 2');
						testTourneyGetStatus('0', Constants.NO_TOURNEY).then( (result) => {
							Console.log(result);
							cur_test = printTestName('Tourney Get Run Status 1');
							testTourneyGetRunStatus(t_id, null).then( (result) => {
								Console.log(result);
								fulfill(true);
							}).catch( (err) =>{
								testFailed(reject, cur_test, err);
							});
						}).catch( (err) =>{
							testFailed(reject, cur_test, err);
						});
					}).catch( (err) =>{
						testFailed(reject, cur_test, err);
					});
				}).catch( (err) =>{
					testFailed(reject, cur_test, err);
				});
			}).catch( (err) =>{
				testFailed(reject, cur_test, err);
			});
		}).catch( (err) =>{
			testFailed(reject, cur_test, err);
		});
	});
};

var runTourneyAdvanceTests = (t_id) => {
	return new Promise( (fulfill, reject) => {
		var cur_test = printTestName('Tourney Advance Status 1');
		testTourneyAdv(t_id, Constants.UPDATE_SUCCESS).then( () => {
			cur_test = printTestName('Tourney Advance Status 2');
			testTourneyAdv('0', Constants.NO_TOURNEY).then( () => {
				cur_test = printTestName('Tourney Advance Status 3');
				testTourneyAdv(t_id, Constants.UPDATE_SUCCESS).then( () => {
					cur_test = printTestName('Tourney Get Run Status 2');
					var cur_state = Constants.STATE_MATCH;
					testTourneyGetRunStatus(t_id, cur_state).then ( () => {
						cur_test = printTestName('Tourney Advance Run Status 1');
						testTourneyAdvRunState(t_id).then( () => {
							cur_test = printTestName('Tourney Get Run Status 3');
							cur_state = Constants.STATE_ADV_MATCH;
							testTourneyGetRunStatus(t_id, cur_state).then ( () => {
								cur_test = printTestName('Tourney Advance Run Status 2');
								testTourneyAdvRunState(t_id).then( () => {
									cur_test = printTestName('Tourney Get Run Status 4');
									cur_state = Constants.STATE_DISPUTE;
									testTourneyGetRunStatus(t_id, cur_state).then ( () => {
										cur_test = printTestName('Tourney Advance Run Status 3');
										testTourneyAdvRunState(t_id).then( () => {
											cur_test = printTestName('Tourney Get Run Status 5');
											cur_state = Constants.STATE_ADV_DISPUTE;
											testTourneyGetRunStatus(t_id, cur_state).then ( () => {
												cur_test = printTestName('Tourney Advance Run Status 4');
												testTourneyAdvRunState(t_id).then( () => {
													cur_test = printTestName('Tourney Get Run Status 6');
													cur_state = Constants.STATE_MATCH;
													testTourneyGetRunStatus(t_id, cur_state).then ( () => {
														fulfill(true);
													}).catch( (err) =>{
														testFailed(reject, cur_test, err);
													});
												}).catch( (err) =>{
													testFailed(reject, cur_test, err);
												});
											}).catch( (err) =>{
												testFailed(reject, cur_test, err);
											});
										}).catch( (err) =>{
											testFailed(reject, cur_test, err);
										});
									}).catch( (err) =>{
										testFailed(reject, cur_test, err);
									});
								}).catch( (err) =>{
									testFailed(reject, cur_test, err);
								});
							}).catch( (err) =>{
								testFailed(reject, cur_test, err);
							});
						}).catch( (err) =>{
							testFailed(reject, cur_test, err);
						});
					}).catch( (err) =>{
						testFailed(reject, cur_test, err);
					});
				}).catch( (err) =>{
					testFailed(reject, cur_test, err);
				});
			}).catch( (err) =>{
				testFailed(reject, cur_test, err);
			});
		}).catch( (err) =>{
			testFailed(reject, cur_test, err);
		});
	});
};

var runTeamCreationSetGetTests = (t_id) => {
	return new Promise( (fulfill, reject) => {
		var role_ids = [];
		var names = [];
		for (var i = 0; i < 4; i++){
			var role = 'r_' + i.toString();
			var name = 'n_' + i.toString();
			role_ids.push(role);
			names.push(name);
		}
		var team_ids = [];
		i = 0;
		var cur_test = printTestName('Tourney Team Creation ' + i.toString());
		testCreateTeam(t_id, role_ids[i], names[i]).then( (tm_id) => {
			team_ids.push(tm_id);
			cur_test = printTestName('Get Team ID By Role ID ' + i.toString());
			testGetTeamIDByRoleID(t_id, role_ids[i], team_ids[i]).then( () => {
				cur_test = printTestName('Get Team ID By Name ' + i.toString());
				testGetTeamIDByName(t_id, names[i], team_ids[i]).then( () => {
					i = 1;
					cur_test = printTestName('Tourney Team Creation ' + i.toString());
					testCreateTeam(t_id, role_ids[i], names[i]).then( (tm_id) => {
						team_ids.push(tm_id);
						cur_test = printTestName('Get Team ID By Role ID ' + i.toString());
						testGetTeamIDByRoleID(t_id, role_ids[i], team_ids[i]).then( () => {
							cur_test = printTestName('Get Team ID By Name ' + i.toString());
							testGetTeamIDByName(t_id, names[i], team_ids[i]).then( () => {
								i = 2;
								cur_test = printTestName('Tourney Team Creation ' + i.toString());
								testCreateTeam(t_id, role_ids[i], names[i]).then( (tm_id) => {
									team_ids.push(tm_id);
									cur_test = printTestName('Get Team ID By Role ID ' + i.toString());
									testGetTeamIDByRoleID(t_id, role_ids[i], team_ids[i]).then( () => {
										cur_test = printTestName('Get Team ID By Name ' + i.toString());
										testGetTeamIDByName(t_id, names[i], team_ids[i]).then( () => {
											i = 3;
											cur_test = printTestName('Tourney Team Creation ' + i.toString());
											testCreateTeam(t_id, role_ids[i], names[i]).then( (tm_id) => {
												team_ids.push(tm_id);
												cur_test = printTestName('Get Team ID By Role ID ' + i.toString());
												testGetTeamIDByRoleID(t_id, role_ids[i], team_ids[i]).then( () => {
													cur_test = printTestName('Get Team ID By Name ' + i.toString());
													testGetTeamIDByName(t_id, names[i], team_ids[i]).then( () => {
														var data = [role_ids, team_ids, names];
														Console.log(team_ids);
														fulfill(data);
													}).catch( (err) => {
														testFailed(reject, cur_test, err);
													});
												}).catch( (err) => {
													testFailed(reject, cur_test, err);
												});
											}).catch( (err) => {
												testFailed(reject, cur_test, err);
											});
										}).catch( (err) => {
											testFailed(reject, cur_test, err);
										});
									}).catch( (err) => {
										testFailed(reject, cur_test, err);
									});
								}).catch( (err) => {
									testFailed(reject, cur_test, err);
								});
							}).catch( (err) => {
								testFailed(reject, cur_test, err);
							});
						}).catch( (err) => {
							testFailed(reject, cur_test, err);
						});
					}).catch( (err) => {
						testFailed(reject, cur_test, err);
					});
				}).catch( (err) => {
					testFailed(reject, cur_test, err);
				});
			}).catch( (err) => {
				testFailed(reject, cur_test, err);
			});
		}).catch( (err) => {
			testFailed(reject, cur_test, err);
		});
	});
};

var runTeamGetSetChallonge = (t_id, team_ids) => {
	return new Promise( (fulfill, reject) => {
		var chall_ids = [];
		for (var i = 0; i < 4; i++){
			var chall_id = 'C_' + i.toString();
			chall_ids.push(chall_id);
		}
		i = 0;
		var cur_test = printTestName('Team Set Challonge ID ' + i.toString());
		testSetTeamChallongeID(t_id, team_ids[i], chall_ids[i], Constants.UPDATE_SUCCESS).then( () => {
			i = 1;
			cur_test = printTestName('Team Set Challonge ID ' + i.toString());
			testSetTeamChallongeID(t_id, team_ids[i], chall_ids[i], Constants.UPDATE_SUCCESS).then( () => {
				i = 2;
				cur_test = printTestName('Team Set Challonge ID ' + i.toString());
				testSetTeamChallongeID(t_id, team_ids[i], chall_ids[i], Constants.UPDATE_SUCCESS).then( () => {
					i = 3;
					cur_test = printTestName('Team Set Challonge ID ' + i.toString());
					testSetTeamChallongeID(t_id, team_ids[i], chall_ids[i], Constants.UPDATE_SUCCESS).then( () => {
						i = 0;
						cur_test = printTestName('Team Get Challonge ID ' + i.toString());
						testGetTeamChallongeID(t_id, team_ids[i], chall_ids[i]).then( () => {
							i = 1;
							cur_test = printTestName('Team Get Challonge ID ' + i.toString());
							testGetTeamChallongeID(t_id, team_ids[i], chall_ids[i]).then( () => {
								i = 2;
								cur_test = printTestName('Team Get Challonge ID ' + i.toString());
								testGetTeamChallongeID(t_id, team_ids[i], chall_ids[i]).then( () => {
									i = 3;
									cur_test = printTestName('Team Get Challonge ID ' + i.toString());
									testGetTeamChallongeID(t_id, team_ids[i], chall_ids[i]).then( () => {
										fulfill(chall_ids);
									}).catch( (err) => {
										testFailed(reject, cur_test, err);
									});
								}).catch( (err) => {
									testFailed(reject, cur_test, err);
								});
							}).catch( (err) => {
								testFailed(reject, cur_test, err);
							});
						}).catch( (err) => {
							testFailed(reject, cur_test, err);
						});
					}).catch( (err) => {
						testFailed(reject, cur_test, err);
					});
				}).catch( (err) => {
					testFailed(reject, cur_test, err);
				});
			}).catch( (err) => {
				testFailed(reject, cur_test, err);
			});
		}).catch( (err) => {
			testFailed(reject, cur_test, err);
		});
	});
};

var runDBTestsA = (t_id,c_id) => {
	return new Promise((fulfill, reject) => {
		runTourneyCreateDeleteTest(t_id).then( (result) => {
			Console.log(result);
			runTourneyPropertiesGetSetTest(t_id, c_id).then( (result) => {
				Console.log(result);
				runTourneyAdvanceTests(t_id).then( (result) => {
					Console.log(result);
					runTeamCreationSetGetTests(t_id).then( (data) => {
						var role_ids = data[0];
						var team_ids = data[1];
						Console.log(team_ids);
						// var names = data[2];
						printTestName('Tourney Get Teams');
						testTourneyGetTeams(t_id, role_ids).then((result) => {
							Console.log(result);
							runTeamGetSetChallonge(t_id, team_ids).then( (data) => {
								var challonge_ids = data;
								var results = [role_ids, team_ids, challonge_ids];
								fulfill(results);
							}).catch( (err) => {
								testFailed(reject, 'TeamGetSetChallonge', err);
							});
						}).catch( (err) => {
							testFailed(reject, 'TestTourneyGetTeams', err);
						});
					}).catch( (err) => {
						testFailed(reject, 'TestTeamCreationSetGet', err);
					});
				}).catch( (err) => {
					testFailed(reject, 'TestTourneyAdvance', err);
				});
			}).catch( (err) => {
				testFailed(reject, 'TestTourneySetGetProperties', err);
			});
		}).catch( (err) => {
			testFailed(reject, 'TestTourneyCreateDelete', err);
		});
	});
};

var runSetGetTeamRoleTests = (t_id, role_ids, team_ids) => {
	return new Promise((fulfill, reject) => {
		var i = 0;
		var cur_test = printTestName('Get Team Role ID ' + i.toString());
		testGetTeamRoleID(t_id, team_ids[i], role_ids[i]).then( () => {
			i = 1;
			cur_test = printTestName('Get Team Role ID ' + i.toString());
			testGetTeamRoleID(t_id, team_ids[i], role_ids[i]).then( () => {
				i = 2;
				cur_test = printTestName('Get Team Role ID ' + i.toString());
				testGetTeamRoleID(t_id, team_ids[i], role_ids[i]).then( () => {
					i = 3;
					cur_test = printTestName('Get Team Role ID ' + i.toString());
					testGetTeamRoleID(t_id, team_ids[i], role_ids[i]).then( () => {
						i = 0;
						var upd_roles = ['role0','role1','role2','role3'];
						cur_test = printTestName('Set Team Role ID ' + i.toString());
						testSetTeamRoleID('0', team_ids[i], upd_roles[i], Constants.NO_TOURNEY).then( () => {
							cur_test = printTestName('Set Team Role ID ' + i.toString());
							testSetTeamRoleID(t_id, team_ids[i], upd_roles[i], Constants.UPDATE_SUCCESS).then( () => {
								i = 1;
								cur_test = printTestName('Set Team Role ID ' + i.toString());
								testSetTeamRoleID(t_id, team_ids[i], upd_roles[i], Constants.UPDATE_SUCCESS).then( () => {
									i = 2;
									cur_test = printTestName('Set Team Role ID ' + i.toString());
									testSetTeamRoleID(t_id, team_ids[i], upd_roles[i], Constants.UPDATE_SUCCESS).then( () => {
										i = 3;
										cur_test = printTestName('Set Team Role ID ' + i.toString());
										testSetTeamRoleID(t_id, team_ids[i], upd_roles[i], Constants.UPDATE_SUCCESS).then( () => {
											fulfill(upd_roles);
										}).catch( (err) => {
											testFailed(reject, cur_test, err);
										});
									}).catch( (err) => {
										testFailed(reject, cur_test, err);
									});
								}).catch( (err) => {
									testFailed(reject, cur_test, err);
								});
							}).catch( (err) => {
								testFailed(reject, cur_test, err);
							});
						}).catch( (err) => {
							testFailed(reject, cur_test, err);
						});
					}).catch( (err) => {
						testFailed(reject, cur_test, err);
					});
				}).catch( (err) => {
					testFailed(reject, cur_test, err);
				});
			}).catch( (err) => {
				testFailed(reject, cur_test, err);
			});
		}).catch( (err) => {
			testFailed(reject, cur_test, err);
		});
	});
};

var runTestCreateGetParticipants = (t_id, team_ids) => {
	return new Promise((fulfill, reject) => {
		
	});
};

var runTestCreateDisputes = (t_id, team_ids, teams) => {
	return new Promise((fulfill, reject) => {
		
	});
};

var runTestCreateGetChannels = (t_id, role_ids) => {
	return new Promise((fulfill, reject) => {
		
	});
};

var runTestResolveDisputes = (t_id, team_ids, teams, defendants) => {
	return new Promise((fulfill, reject) => {
		
	});
};

var runTestDeleteChannels = (t_id, channels) => {
	return new Promise((fulfill, reject) => {
		
	});
};

var runTestRemoveParticipant = (t_id, team_ids, teams) => {
	return new Promise((fulfill, reject) => {
		
	});
};

var runTestRemoveTeams = (t_id, team_ids) => {
	return new Promise((fulfill, reject) => {
		
	});
};

var runDBTestsB = (t_id,c_id, data) => {
	return new Promise((fulfill, reject) => {
		var role_ids = data[0];
		var team_ids = data[1];
		runSetGetTeamRoleTests(t_id, role_ids, team_ids).then( (upd_roles) => {
			role_ids = upd_roles;
			runTestCreateGetParticipants(t_id, team_ids).then( (teams) => {
				runTestCreateGetChannels(t_id, role_ids).then( (channels) => {
					runTestCreateDisputes(t_id, team_ids, teams).then( (defendants) => {
						runTestResolveDisputes(t_id, team_ids, teams, defendants).then( () => {
							runTestDeleteChannels(t_id, channels).then( () => {
								runTestRemoveParticipant(t_id, team_ids, teams).then( () => {
									runTestRemoveTeams(t_id, team_ids).then( () => {
										testTourneyDeletion(t_id).then( (status)=> {
											fulfill(status);
										}).catch( (err) => {
											testFailed(reject, 'TestTourneyDelete', err);
										});
									}).catch( (err) => {
										testFailed(reject, 'TestRemoveTeams', err);
									});
								}).catch( (err) => {
									testFailed(reject, 'TestRemoveParticipant', err);
								});
							}).catch( (err) => {
								testFailed(reject, 'TestChannelDelete', err);
							});
						}).catch( (err) => {
							testFailed(reject, 'TestResolveDisputes', err);
						});
					}).catch( (err) => {
						testFailed(reject, 'TestDisputeCreate', err);
					});
				}).catch( (err) => {
					testFailed(reject, 'TestChannelCreate', err);
				});
			}).catch( (err) => {
				testFailed(reject, 'TestParticipantCreate', err);
			});
		}).catch( (err) => {
			testFailed(reject, 'TestTourneySetGetRole', err);
		});
	});
};

exports.runDBTests = () => {
	return new Promise((fulfill, reject) => {
		var t_id = '1234';
		var c_id = 'c1234';
		runDBTestsA(t_id,c_id).then( (result) => {
			runDBTestsB(t_id, c_id, result).then( (result)=> {
				Console.log(result === Constants.REMOVE_SUCCESS);
				fulfill('Test Passed');
			}).catch( (err) => {
				testFailed(reject, 'RunDBTestsB', err);
			});
		}).catch( (err) => {
			testFailed(reject, 'RunDBTestsA', err);
		});
	});
};

// cur_test = printTestName('Tourney Get Teams');
// 		testTourneyGetTeams(t_id, role_ids)


// var testTourneyGetParticipants = (t_id, discord_ids) => {
//     db.getTournamentTeams(t_id).then( (participants) => {
//         for (var i = 0; i < discord_ids.length; i++){
//             if (!assert.strictEqual(participants[i].ids.discord_id, discord_ids[i])){
//                 reject(false);
//             }
//         }
//         return true;
//     }).catch( (err) => {
//         Console.log(err);
//         reject(false);
//     });
// };

// var testTourneyGetChannels = (t_id, channel_ids) => {
//     db.getTournamentChannels(t_id).then( (channels) => {
//         for (var i = 0; i < channel_ids.length; i++){
//             if (!assert.strictEqual(channels[i].channel_id, channel_ids[i])){
//                 reject(false);
//             }
//         }
//         return true;
//     }).catch( (err) => {
//         Console.log(err);
//         reject(false);
//     });
// };

// var testTourneyGetDisputes = (t_id, dispute_def_ori) => {
//     db.getTournamentDisputes(t_id).then( (disputes) => {
//         for (var i = 0; i < dispute_def_ori.length; i++){
//             if (!assert.strictEqual(disputes[i].originator, dispute_def_ori[i].originator)){
//                 reject(false);
//             }
//             if (!assert.strictEqual(disputes[i].defendant, dispute_def_ori[i].defendant)){
//                 reject(false);
//             }
//         }
//         return true;
//     }).catch( (err) => {
//         Console.log(err);
//         reject(false);
//     });
// };



// var testRemoveTeam = (t_id, role_id, t_status) => {
//     db.removeTeam(t_id, role_id).then( (status) => {
//         assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         reject(false);
//     });
// };



// var testGetTeamCreatorByTeamID = (t_id, tm_id, t_status) => {
//     db.getTeamCreatorByTeamID(t_id, tm_id).then( (status) => {
//         assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         reject(false);
//     });
// };

// var testGetTeamCreatorByRoleID = (t_id, r_id, t_status) => {
//     db.getTeamCreatorByRoleID(t_id, r_id).then( (status) => {
//         assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         reject(false);
//     });
// };

// var testSetTeamChallongeID = (t_id, tm_id, c_id, t_status) => {
//     db.setTeamChallongeID(t_id, tm_id, c_id).then( (status) => {
//         assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         reject(false);
//     });
// };

// var testGetTeamChallongeID = (t_id, tm_id, t_status) => {
//     db.getTeamChallongeID(t_id, tm_id).then( (status) => {
//         assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         reject(false);
//     });
// };

// var testSetTeamRoleID = (t_id, tm_id, r_id, t_status) => {
//     db.setTeamRoleID(t_id, tm_id, r_id).then( (status) => {
//         assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         reject(false);
//     });
// };

// var testGetTeamRoleID = (t_id, tm_id, t_status) => {
//     db.getTeamRoleID(t_id, tm_id).then( (status) => {
//         assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         reject(false);
//     });
// };

// var testCreateParticipant = (t_id, name, d_id, tm_id, t_status) => {
//     db.createParticipant(t_id, name, d_id, tm_id).then( (status) => {
//         assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         reject(false);
//     });
// };

// var testRemoveParticipant = (t_id, d_id, t_status) => {
//     db.removeParticipant(t_id, d_id).then( (status) => {
//         assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         reject(false);
//     });
// };

// var testGetParticipantDiscordID = (t_id, name, t_status) => {
//     db.getParticipantDiscordID(t_id, name).then( (status) => {
//         assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         reject(false);
//     });
// };

// var testGetParticipantTeamID = (t_id, d_id, t_status) => {
//     db.getParticipantTeamID(t_id, d_id).then( (status) => {
//         assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         reject(false);
//     });
// };

// var testCreateDispute = (t_id, o_id, d_id, d_type, add_info,  t_status) => {
//     db.createDispute(t_id, o_id, d_id, d_type, add_info).then( (status) => {
//         assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         reject(false);
//     });
// };

// var testResolveDispute = (t_id, d_id, t_status) => {
//     db.resolveDispute(t_id, d_id).then( (status) => {
//         assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         reject(false);
//     });
// };

// var testResolveDisputesByType = (t_id, d_type, t_status) => {
//     db.resolveDisputesByType(t_id, d_type).then( (status) => {
//         assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         reject(false);
//     });
// };

// var testGetDisputeID = (t_id, def_id, t_status) => {
//     db.getDisputeID(t_id, def_id).then( (status) => {
//         assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         reject(false);
//     });
// };

// var testGetDisputeByID = (t_id, d_id, t_status) => {
//     db.getDisputeByID(t_id, d_id).then( (status) => {
//         if (t_status.length > 0){
//             assert.strictEqual(status, t_status);
//         } else {
//             assert.strictEqual(status._id, d_id);
//         }
//     }).catch( (err) => {
//         Console.log(err);
//         reject(false);
//     });
// };

// var testCreateChannel = (t_id, c_id, c_type, ref_id,  t_status) => {
//     db.createChannel(t_id, c_id, c_type, ref_id).then( (status) => {
//         assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         reject(false);
//     });
// };

// var testDeleteChannel = (t_id, c_id, t_status) => {
//     db.deleteChannel(t_id, c_id).then( (status) => {
//         assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         reject(false);
//     });
// };

// var testGetChannelType = (t_id, c_id, t_status) => {
//     db.getChannelType(t_id, c_id).then( (status) => {
//         assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         reject(false);
//     });
// };

// var testDeleteChannelsByType = (t_id, c_type, t_status) => {
//     db.deleteChannelsByType(t_id, c_type).then( (status) => {
//         assert.strictEqual(status, t_status);
//     }).catch( (err) => {
//         Console.log(err);
//         reject(false);
//     });
// };
// };

module.exports = exports;

if (!module.parent) {
	exports.runDBTests().then( (status) => {
		Console.log(status);
		wipeDB().then( () =>{
			process.exit();
		});
	});
}