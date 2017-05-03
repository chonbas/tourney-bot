/**
RUN TOURNEY HANDLER
Once participants have joined, this handler interacts
with them to
- notify them of matches
- set up match channels
- receive match reports and verify/time out
- if final match, advance tournament

Also, it implements the vote-kick jury system
- listen for user reports
- set up jury channel
- detect vote-kick

This is a complex handler that should be broken up
into multiple handlers!!
*/

var handler = {};

handler.handleMsg = (msg) => {
	msg.reply('run-tourney handler called');
};


module.exports = handler;
