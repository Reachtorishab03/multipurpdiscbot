// Dependencies
const { functions: { checkMusic } } = require('../../utils'),
	Command = require('../../structures/Command.js');

module.exports = class Back extends Command {
	constructor(bot) {
		super(bot, {
			name: 'back',
			dirname: __dirname,
			aliases: ['previous', 'prev'],
			botPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'SPEAK'],
			description: 'Plays the previous song in the queue.',
			usage: 'back',
			cooldown: 3000,
			slash: true,
		});
	}

	// Function for message command
	async run(bot, message) {
		// check for DJ role, same VC and that a song is actually playing
		const playable = checkMusic(message.member, bot);
		if (typeof (playable) !== 'boolean') return message.channel.error(playable).then(m => m.timedDelete({ timeout: 10000 }));

		// Make sure there was a previous song
		const player = bot.manager.players.get(message.guild.id);
		if (player.queue.previous == null) return message.channel.send(message.translate('music/back:NO_PREV'));

		// Start playing the previous song
		player.queue.unshift(player.queue.previous);
		player.stop();
	}

	// Function for slash command
	async callback(bot, interaction, guild) {
		const member = guild.members.cache.get(interaction.user.id),
			channel = guild.channels.cache.get(interaction.channelID);

		// check for DJ role, same VC and that a song is actually playing
		const playable = checkMusic(member, bot);
		if (typeof (playable) !== 'boolean') return bot.send(interaction, { embeds: [channel.error(playable, {}, true)], ephemeral: true });

		// Make sure there was a previous song
		const player = bot.manager.players.get(member.guild.id);
		if (player.queue.previous == null) return await bot.send(interaction, { content: guild.translate('music/back:NO_PREV') });

		// Start playing the previous song
		player.queue.unshift(player.queue.previous);
		player.stop();
	}
};
