# Tourneybot

## Usage


## Hosting Instructions
Want to host Tourneybot? That's great! Here's how you do it. 
### Installation
1. Install [NodeJS](https://nodejs.org/en/) and [MongoDB](https://www.mongodb.com/download-center#community)'s community server.
1. Clone the repository.
1. In a terminal, enter `$npm install`. 
1. Edit credentials.js.TEMPLATE. You will need accounts on these sites.
   * [Discord API token](https://discordapi.com/): Go to "My Apps", create a new app, and add a bot user. Use the token under "App Bot User". 
   * [Challonge API token](https://challonge.com/): Go to "Settings", "Developer API", and generate an API key. Use that. 
1. TODO: db initialization (mongoose)

### Running the bot
After installing, to actually run Tourneybot you will need to do a couple things. 
1. Run MongoDB on your computer. For instructions, click [here](https://docs.mongodb.com/getting-started/shell/installation/), select the installation guide for your OS and scroll down to "Run MongoDB".
1. Make a link to add Tourneybot to servers. 
   1. Get your Client ID. Visit the [Discord API](https://discordapi.com/) site, go to "My Apps", click on the app, and under "App Details" copy the Client ID. 
   1. Open this [permissions calculator](https://discordapi.com/permissions.html). 
   1. Where it says "Insert Client ID here", insert your client ID. 
   1. Check the boxes for THESE PERMISSIONS (TODO).  
1. In a terminal, enter `$npm run start`. 
1. Open or share the link you created to add the bot to whatever servers you wish. 

### Deployment
TODO

## Contribute

Thank you!! Please see [CONTRIBUTE.md](CONTRIBUTE.md).

## License
TODO
