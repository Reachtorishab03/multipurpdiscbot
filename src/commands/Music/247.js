// Dependencies
const { functions: { checkMusic } } = require('../../utils'),
	Command = require('../../structures/Command.js');

module.exports = class TwentyFourSeven extends Command {
	constructor(bot) {
		super(bot, {
			name: '247',
			dirname: __dirname,
			aliases: ['stay', '24/7'],
			botPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'SPEAK'],
			description: 'Stays in the voice channel even if no one is in it.',
			usage: '24/7',
			cooldown: 3000,
			slash: true,
		});
	}

	// Function for message command
	async run(bot, message) {
		// check for DJ role, same VC and that a song is actually playing
		const playable = checkMusic(message.member, bot);
		if (typeof (playable) !== 'boolean') return message.channel.error(playable).then(m => m.timedDelete({ timeout: 10000 }));

		// toggle 24/7 mode off and on
		const player = bot.manager.players.get(message.guild.id);
		player.twentyFourSeven = !player.twentyFourSeven;
		message.channel.send(message.translate('music/247:RESP', { TOGGLE: player.twentyFourSeven }));
	}

	// Function for slash command
	async callback(bot, interaction, guild) {
		const member = guild.members.cache.get(interaction.user.id),
			channel = guild.channels.cache.get(interaction.channelID);

		// check for DJ role, same VC and that a song is actually playing
		const playable = checkMusic(member, bot);
		if (typeof (playable) !== 'boolean') return bot.send(interaction, { embeds: [channel.error(playable, {}, true)], ephemeral: true });

		// toggle 24/7 mode off and on
		const player = bot.manager.players.get(member.guild.id);
		player.twentyFourSeven = !player.twentyFourSeven;
		await bot.send(interaction, { content: bot.translate('music/247:RESP', { TOGGLE: player.twentyFourSeven }) });
	}
};
