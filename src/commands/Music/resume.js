// Dependencies
const { functions: { checkMusic } } = require('../../utils'),
	Command = require('../../structures/Command.js');

module.exports = class Resume extends Command {
	constructor(bot) {
		super(bot, {
			name: 'resume',
			dirname: __dirname,
			aliases: ['previous', 'prev'],
			botPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'SPEAK'],
			description: 'Resumes the music.',
			usage: 'resume',
			cooldown: 3000,
		});
	}

	// Function for message command
	async run(bot, message, settings) {
		// check to make sure bot can play music based on permissions
		const playable = checkMusic(message.member, bot);
		if (typeof (playable) !== 'boolean') return message.channel.error(playable).then(m => m.timedDelete({ timeout: 10000 }));

		const player = bot.manager.players.get(message.guild.id);

		// The music is already resumed
		if (!player.paused) return message.channel.error('music/resume:IS_RESUMED', { PREFIX: settings.prefix });

		// Resumes the music
		player.pause(false);
		return message.channel.success('music/resume:SUCCESS');
	}

	// Function for slash command
	async callback(bot, interaction, guild) {
		const member = guild.members.cache.get(interaction.user.id),
			channel = guild.channels.cache.get(interaction.channelID);

		// check for DJ role, same VC and that a song is actually playing
		const playable = checkMusic(member, bot);
		if (typeof (playable) !== 'boolean') return bot.send(interaction, { embeds: [channel.error(playable, {}, true)], ephemeral: true });

		// The music is already resumed
		const player = bot.manager.players.get(member.guild.id);
		if (!player.paused) return bot.send(interaction, { ephemeral: true, embeds: [channel.error('music/resume:IS_RESUMED', {}, true)] });

		// Resumes the music
		player.pause(false);
		return bot.send(interaction, { embeds: [channel.error('music/resume:SUCCESS', {}, true)] });
	}
};
