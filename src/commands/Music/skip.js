// Dependencies
const { functions: { checkMusic } } = require('../../utils'),
	Command = require('../../structures/Command.js');

module.exports = class Skip extends Command {
	constructor(bot) {
		super(bot, {
			name:  'skip',
			dirname: __dirname,
			aliases: ['next', 'skipto'],
			botPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'SPEAK'],
			description: 'Skips the current song.',
			usage: 'skip',
			cooldown: 3000,
			slash: true,
			options: [{
				name: 'amount',
				description: 'position in queue to skip to',
				type: 'INTEGER',
				required: false,
			}],
		});
	}

	// Function for message command
	async run(bot, message) {
		// check to make sure bot can play music based on permissions
		const playable = checkMusic(message.member, bot);
		if (typeof (playable) !== 'boolean') return message.channel.error(playable).then(m => m.timedDelete({ timeout: 10000 }));

		const player = bot.manager.players.get(message.guild.id);

		// skip song
		if (!isNaN(message.args[0]) && message.args[0] < player.queue.length) {
			player.stop(parseInt(message.args[0]));
		} else {
			player.stop();
		}
	}

	// Function for slash command
	async callback(bot, interaction, guild, args) {
		const member = guild.members.cache.get(interaction.user.id),
			channel = guild.channels.cache.get(interaction.channelID),
			amount = args.get('amount')?.value;

		// check for DJ role, same VC and that a song is actually playing
		const playable = checkMusic(member, bot);
		if (typeof (playable) !== 'boolean') return bot.send(interaction, { embeds: [channel.error(playable, {}, true)], ephemeral: true });

		// skip song
		const player = bot.manager.players.get(member.guild.id);
		if (!isNaN(amount) && amount < player.queue.length) {
			player.stop(amount);
		} else {
			player.stop();
		}
	}
};
