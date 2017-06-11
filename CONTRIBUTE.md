# Contributing

Thank you for your consideration! If you'd like to develop more for this bot, here's some additional information that can help you.

## Manual Testing

Unfortunately, we're not really sure how to run mocha-style tests for the bot. Instead, we have a silly hack for testing everything manually, where we run fake bots that echo your actions to simulate actual users. Teehee.

#### How to run the fake users:
1. [Discord API tokens](https://discordapi.com/): Go to "My Apps", create a new app, and add as many bot users as you like. Use the tokens under "App Bot User". Copy them one by one into `credentials.js` under TEST_TOKENS. You can put as many as you like in the array.
2. In the command line, write `npm run bots`.

#### How to use the bots and what they do:

* Upon boot, they send a message to the default channel (#general) in all guilds they're in.
* To make them send a message, write `@testbot` and type your message. They take any messages starting with `@testbot` and resend the message replacing the `@testbot` with `@target` for each target, where `@target`s are all users who have `tourney` in the name.
  * Example: I write `@testbot hello @friend`, where `testbot`'s token is stored in my TEST_TOKENS. `testbot` then will reply `@tourney_bot hello @friend` if there is a player/bot named `@tourney_bot`.
* To trigger emoji-echoing, like any message the bot has sent. It will send you a message letting you know it's echoing you. It will then like any messages you do. To make it stop, write `@testbot stop`.
*
### TODO: figure out crediting contributors etc.
