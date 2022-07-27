import os
from discord.ext import commands
from discord.utils import get
import discord

client = discord.Client()

bot = commands.Bot(command_prefix="!")
TOKEN = os.getenv("DISCORD_TOKEN")         # To do

@bot.event      # Change to our bot parameters
async def on_ready():
    print(f"Logged in as {bot.user.name}({bot.user.id})")

@bot.command()
async def ping(ctx):
    await ctx.send("pong")

if __name__ == "__main__":
    bot.run(TOKEN)

@client.event
async def on_voice_state_update(member, before, after):
    if str(after.channel) == 'Join to create channel':
        if str(after) != str(before):
            await after.channel.clone(name=f'{member}s channel')
            channel = discord.utils.get(guild.text_channels, name = f"{member}'s channel")
            await member.move_to(channel)

