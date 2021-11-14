const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { token, game, help, happiness, boredom } = require('./config.json');
const fs = require('fs');

const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
var explosion;

bot.once('ready', () => {
  console.log(`Logged into ${bot.guilds.cache.size} servers`);
  
  bot.user.setActivity(game, { type: "PLAYING" });
  
  explosion = "`";
  explosion += "     _.-^^---....,,--       \n";
  explosion += " _--                  --_   \n";
  explosion += "<                        >) \n";
  explosion += "|                         | \n";
  explosion += " \._                   _./  \n";
  explosion += "    ```--. . , ; .--'''     \n";
  explosion += "          | |   |           \n";
  explosion += "       .-=||  | |=-.        \n";
  explosion += "       '-=#$%&%$#=-'        \n";
  explosion += "          | ;  :|           \n";
  explosion += "_____.,-#%&$@%#&#~,._____   `";
});
 
var data = 
    {
      token: token,
      game: game,
      help: help,
      happiness: happiness
    }

var votes = {}
var bank = {}
var inv = {}
var daily = {}
var cheese = {}

var lastSite = "";

bot.on('messageCreate', async message =>
{
  var user = message.author.id;
  
  if(inv[user] == undefined) inv[user] = [];
  balance(user);

  if(cheese[user] != undefined)
  {
    if(cheese[user] + 1000*60*10 > (new Date()).getMilliseconds())
    {
      bank[user]++;
    } else
    {
      cheese[user] = undefined;
    }
  }
  bank[user]++;
  
  if (message.content.substring(0, 1) == "!")
  {
    var args = message.content.substring(1).split(' ');
    var cmd = args[0];
        
    switch(cmd)
    {
      case "ping":
        message.channel.send("Pong!");
        break;
        
      case "setgame":
        var game = message.content.substring(9)
        bot.user.setActivity(game, { type: "PLAYING" });
        
        message.channel.send("Okay I'll play " + game);
        
        data.game = game;
        fs.writeFileSync(".\config.json", JSON.stringify(data));
        
        break;
        
      case "help":
        message.channel.send(help);
        break;
        
      case "invite":
        message.channel.send("You can add me to your server using this link: https://discord.com/api/oauth2/authorize?client_id=552838163723452419&permissions=264192&scope=bot");
        break;
        
      case "repeat":
        if(args.length > 1)
        {
          var stringToRepeat = message.content.substring(8).toLowerCase()

          if(stringToRepeat != "im stupid" && stringToRepeat != "i'm stupid")
          {
            message.channel.send(message.content.substring(8));
          } else
          {
            message.channel.send("We know");
          }
        } else
        {
          message.channel.send("What do you want me to say");
        }
        break;
        
      case "bothappy":
        message.channel.send((happiness > 0) ? "Bot is happy" : "Bot is unhappy");
        break;
        
      case "explosion":
      case "megumin":
        message.channel.send(explosion);
        break;
        
      case "sex":
        message.channel.send("https://i.kym-cdn.com/photos/images/newsfeed/001/842/713/b73.jpg");
        break;
        
      case "roll":
        if (args.length > 1) {
          var rules = args[1].split("d");

          if (rules[1] == "")
          {
            var roll = ""

            for (var k = 0; k < parseInt(rules[0]); k++)
            {
              roll += Math.floor(Math.random() * 6 + 1) + "\n"
            }
            message.channel.send(roll.toString())
          } else
          {
            if (rules[0] != "") {
              var roll = ""

              for (var k = 0; k < parseInt(rules[0]); k++)
              {
                roll += (Math.floor(Math.random() * parseInt(rules[1])) + 1) + "\n"
              }
              message.channel.send(roll.toString())
            } else
            {
              message.channel.send((Math.floor(Math.random() * parseInt(rules[1])) + 1).toString())
            }
          }
        } else
        {
          message.channel.send(Math.round((Math.random() * 6 + 1)).toString())
        }
        break;
        
      case "flip":
        message.channel.send(Math.round(Math.random() * 2) == 1 ? "Heads" : "Tails");
        break;
        
      case "imbored":
        var site = boredom[Math.floor(Math.random() * boredom.length)];
        while(site == lastSite)
        {
          site = boredom[Math.floor(Math.random() * boredom.length)];
        }
        lastSite = site;
        
        const button = new MessageActionRow().addComponents(
          new MessageButton()
          .setURL(site)
          .setLabel("I'm bored.")
          .setStyle("LINK")
        );
        
        message.channel.send({content:"Ok.", components:[button]});
        break;
        
      case "wint":
        message.author.send("https://discord.gg/uasyTmCcCs");
        break;
        
      case "dungeon":
        message.channel.send("https://donjon.bin.sh/fantasy/dungeon/preview.cgi?seed=" + Math.floor(Math.random() * 1000) + "&dungeon_layout=Square");
        break;
        
      case "dungeoncredit":
        message.channel.send("donjon");
        break;
        
      case "id":
        const id = new MessageEmbed()
        .setAuthor("Spencer Naimabadi", bot.user.displayAvatarURL())
        .setDescription("17 Range Way Rd., Mont Vernon NH (United States)\nFulltime Annoyance")
        .setColor("#442691");
        
        message.channel.send({embeds: [id]});
        break;

      case "bal":
      case "balance":
      case "money":
      case "cash":
        message.channel.send(balance(user).toString());
        break;
        
      case "buy":
        if(args.length > 1)
        {
          var amount = 1;
          if(args.length > 2)
          {
            amount = args[2];
          }

          switch(args[1])
          {
            case "lenny":
              buy("lenny", 10, user, amount, `Bought lenny for lazy people`, "Lenny Face");
              break;

            case "cheese":
              buy("cheese", 25, user, amount);
              break;

            case "gun":
              buy("gun", 100, user, amount);
              break;

            case "coffee":
              buy("coffee", 5, user, amount, `Bought the best beverage, coffee`);
              break;
          }
        }
        break;

      case "inv":
        message.channel.send(inv[user].length < 1 ? "Nothing in inventory" : inv[user].toString());
        break;
        
      case "use":
        if(args.length > 1)

          switch(args[1])
          {
            case "lenny":
              if(inv[user].includes("Lenny Face"))
              {
                message.channel.send("( \u0361\u00B0 \u035C\u0296 \u0361\u00B0)");
                for( var i = 0; i < inv[user].length; i++){ 
                  if ( inv[user][i] === "Lenny Face") { 
                    inv[user].splice(i, 1); 
                  }
                }	
              } else message.channel.send("You don't have any lenny faces");
              break;

            case "cheese":
              if(inv[user].includes("cheese"))
              {
                message.channel.send("Mmm cheese, eating this gave you a earnings bonus of 2x for 10 minutes");
                cheese[user] = (new Date()).getMilliseconds();
                for( var i = 0; i < inv[user].length; i++){ 
                  if ( inv[user][i] === "cheese") { 
                    inv[user].splice(i, 1); 
                  }
                }	
              } else message.channel.send("You don't have any cheese");
              break;

            case "test00":
              emojis = ["<:76_million_years:874851568804061244>", "<:art_of_the_deal:874851397923909643>", "<:ive_heard_it_both_ways:874851369364897842>", "<:locked:874851703579611206>", "<:mission_complete:876245565535555704>", "<:the_meaning_of_adventure:874851270891028500>"];
              message.channel.send(emojis[args[2]]);
              break;
          }
        break;
    }
  }
  
  function buy(item, price, user, amount = 1, description = `Bought ${item}`, title = item)
  {
    if(balance(user) >= price * amount)
    {
      bank[user] -= price * amount;

      for(var k = 0; k < amount; k++)
      {
        inv[user].push(title);
      }

      message.channel.send(description + ((amount > 1) ? " " + amount + " times" : ""));
    } else
    {
      message.channel.send("You're to poor");
    }
  }
});

function balance(user)
{
  if(bank[user] == undefined)
  {
    bank[user] = 50;
  }

  return bank[user];
}
bot.login(token);