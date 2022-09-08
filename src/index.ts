import { Client } from './client';
import { TextChannel } from 'discord.js';
import { statusLegacy } from 'minecraft-server-util';

import { ServerConfig } from './types';
import servers from './servers.json';

const client = new Client();

client.once('ready', async () => {
  const commands = [...client.commandManager.keys()].map((key) => {
    return {
      name: key,
      description: client.commandManager?.get(key)?.description,
      options: client.commandManager?.get(key)?.options ?? [],
    };
  });

  await client.application?.commands.set(commands);

  setInterval(() => {
    servers.forEach((server: ServerConfig) => {
      const channel = client.channels.cache.get(
        server.DiscordChannelID
      ) as TextChannel;

      statusLegacy(server.address, server.port, {
        timeout: 10 * 1000,
        enableSRV: true,
      })
        .then((result) => {
          const { version, players, motd, srvRecord } = result;

          channel?.setTopic(
            `:GREEN_CIRCLE: ${players.online}/${players.max} players online | version : ${version?.name}`
          );
        })
        .catch((error) => {
          channel?.setTopic(`:RED_CIRCLE: ${error}`);
        });
    });
  }, 60 * 10 * 1000);
});

client.on('messageCreate', (message) => {});
