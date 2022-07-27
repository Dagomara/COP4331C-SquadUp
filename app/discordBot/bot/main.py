import os
from discord.ext import commands
from discord.utils import get
import discord

client = discord.Client()

activeChannels = {}

#bot = commands.Bot(command_prefix="!")
TOKEN = os.getenv("DISCORD_TOKEN")         # To do

@client.event      # Change to our client parameters
async def on_ready():
    print(f"Logged in as {client.user.name}({client.user.id})")

@client.event
async def on_message(message):
    if message.author == client.user:
        return
    print("channel", type(message.channel.id), "author", type(message.author.id))
    if message.channel.id == 1000140555835158578 and message.author.id == 1000140654434844793:
        ids = message.content.split(" ")[1::]
        command = message.content.split(" ")[0]
        if command == "start":
            print("starting with ids:", ids)
            # put users in the thing
            await message.channel.send("starting with those dudes!")
            guild = message.guild
            print("guild: ", guild)
            category = get(guild.categories, name='Active Matches')
            print(f'category: {category}')
            admin_role = get(guild.roles, name="Admin")
            overwrites = {
                guild.default_role: discord.PermissionOverwrite(read_messages=False),
                admin_role: discord.PermissionOverwrite(read_messages=True)
            }
            for id in ids:
                mem = await client.fetch_user(id)
                overwrites[mem] = discord.PermissionOverwrite(read_messages=True)
            print(f"overwrites: {overwrites}")
            
            # Make text channel
            newChannel = await guild.create_text_channel('Your-SquadUP-Match', overwrites=overwrites, category=category)
            await newChannel.send("@here, your match has started!")
            
            # Make voice channel
            vChannel = await guild.create_voice_channel('Your-SquadUP-Match', overwrites=overwrites, category=category)
            activeChannels["-".join(ids)] = [newChannel, vChannel]
            print("new activeChannels: ", activeChannels)
        else:
            print("ending game with ids:", ids)
            # take users out of the thing
            await message.channel.send("ending with those dudes!")
            try:
                chan = activeChannels["-".join(ids)]
                if chan:
                    for channel in chan:
                        await channel.delete()
            except:
                print("channel doesn't exist :)")

if __name__ == "__main__":
    client.run(TOKEN)


# @client.event
# async def on_voice_state_update(member, before, after):
#     if str(after.channel) == 'Join to create channel':
#         if str(after) != str(before):
#             await after.channel.clone(name=f'{member}s channel')
#             channel = discord.utils.get(guild.text_channels, name = f"{member}'s channel")
#             await member.move_to(channel)

