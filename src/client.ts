import { Client as Base, GatewayIntentBits, Partials } from 'discord.js';
import { CommandManager } from './commandManager';

export class Client extends Base {
  public readonly commandManager: CommandManager;

  public constructor() {
    super({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
      partials: [Partials.Message],
    });

    this.commandManager = new CommandManager();
    this.commandManager.addDir('./commands');
  }
  public async start(): Promise<void> {
    this.on('interactionCreate', async (interaction) => {
      if (!interaction.isCommand()) return;

      if (this.commandManager.has(interaction.commandName)) {
        const { run } = this.commandManager.get(interaction.commandName);
        await run(interaction).catch(console.error);
      }
    });
  }
}
