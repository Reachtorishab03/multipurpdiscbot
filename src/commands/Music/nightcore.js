// Dependencies
const { MessageEmbed } = require('discord.js'),
	{ functions: { checkMusic } } = require('../../utils'),
	Command = require('../../structures/Command.js');

module.exports = class Nightcore extends Command {
	constructor(bot) {
		super(bot, {
			name: 'nightcore',
			dirname: __dirname,
			botPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'SPEAK'],
			description: 'Toggles nightcore mode.',
			usage: 'nightcore',
			cooldown: 3000,
			examples: ['nightcore'],
			slash: true,
		});
	}

	// Function for message command
	async run(bot, message) {
		// check for DJ role, same VC and that a song is actually playing
		const playable = checkMusic(message.member, bot);
		if (typeof (playable) !== 'boolean') return message.channel.error(playable).then(m => m.timedDelete({ timeout: 10000 }));

		// toggle nightcore mode on/off
		const player = bot.manager.players.get(message.guild.id);
		player.setNightcore(!player.nightcore);
		const msg = await message.channel.send(message.translate(`music/nightcore:${player.nightcore ? 'ON' : 'OFF'}_NC`));
		const embed = new MessageEmbed()
			.setDescription(message.translate(`music/nightcore:DESC_${player.nightcore ? '1' : '2'}`));
		await bot.delay(5000);
		if (player.nightcore) player.speed = 1.2;
		return msg.edit({ content: '​​ ', embeds: [embed] });
	}

	// Function for slash command
	async callback(bot, interaction, guild) {
		const member = guild.members.cache.get(interaction.user.id),
			channel = guild.channels.cache.get(interaction.channelID);

		// check for DJ role, same VC and that a song is actually playing
		const playable = checkMusic(member, bot);
		if (typeof (playable) !== 'boolean') return bot.send(interaction, { embeds: [channel.error(playable, {}, true)], ephemeral: true });

		// toggle nightcore mode on/off
		const player = bot.manager.players.get(member.guild.id);
		player.setNightcore(!player.nightcore);
		await bot.send(interaction, { content: guild.translate(`music/nightcore:${player.nightcore ? 'ON' : 'OFF'}_NC`) });
		const embed = new MessageEmbed()
			.setDescription(guild.translate(`music/nightcore:DESC_${player.nightcore ? '1' : '2'}`));
		await bot.delay(5000);
		if (player.nightcore) player.speed = 1.2;
		return interaction.editReply({ content: '​​ ', embeds: [embed] });
	}
};
