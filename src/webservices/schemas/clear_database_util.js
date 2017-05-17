var mongoose = require('mongoose');
const Console = require('../../util/console');
var Guild = require('./guildSchema.js');
var client = require('../../webservices/challonge');

//initialize database, and report access
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', (err) =>{
	Console.error.bind(Console, 'connection error:');
	Console.log(err);
	Console.log('\n\nYou must be running MongoDB. If you are, check the error above for more information.');
});
db.once('open', () => {
	Console.log('Connected to MongoDB. Clearing DB...');
	Guild.remove({}, () => {
		// TODO: delete challonge tournaments before removing from MongoDB
		Console.log('Cleared!');
		//process.exit();
	});
});

client.tournaments.index({
	callback: (err, data) => {
		if(err){
			Console.log('Index failed: ' + err);
			//reject();
		}
		else{
			for(var p in data){
				if (!data.hasOwnProperty(p)) {
					continue;
				}
				var t = data[p].tournament;
				if(t.createdByApi){
					Console.log(p + ' was made by API');
					client.tournaments.destroy({
						id: t.id,
						callback: (err)=> {
							if(err){
								Console.log('Delete failed! for T' + err);
							}
							else{
								Console.log('Delete success: '+t.name);
							}
						}
					});
				}
			}
		}
	}
});

/*
db.getChallongeID(msg.guild.id).then((t_url)=>{
	client.tournaments.destroy({
		id: t_url,
		callback: (err, data) => {
				if(err){
					Console.log(err);
					reject();
				}
				else{
					//Console.log('Started Challonge tournament');
					console.log(err, data);
				}
		}
	});
});
*/
