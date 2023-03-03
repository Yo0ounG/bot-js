const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options.js');

const token = '1792477108:AAG0ghUP765YluzdLBFzM6M-ut-atJ6QdTU';
const bot = new TelegramApi(token, {polling: true});

const chats = [];

const startGame = async (chatId) => {
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;

    await bot.sendMessage(chatId, "The game's just begun! Guess a number between 0 and 10", gameOptions);
};

bot.setMyCommands([
    {
        command: '/start',
        description: 'Welcome gritting',
    },
    {
        command: '/i',
        description: 'Your info',
    },
    {
        command: '/game',
        description: 'Random number game',
    },
    {
        command: '/spam',
        description: 'spam test',
    }
]);

bot.on('message', async msg => {
    const { text } = msg;
    const chatId = msg.chat.id;
    console.log(msg, text);

    if ( text === '/start') {
        await bot.sendSticker(chatId, './sticker.webp');
        return bot.sendMessage(chatId, 'Welcome! Is your life good?');
    }

    if ( text === '/i') {
        return bot.sendMessage(chatId, `Your name is ${msg.from.first_name}`);
    }

    if ( text === '/spam') {
            await bot.sendMessage(chatId, '2 blas will be printed in 4 secs');
            let i = 0;
            let spamId;

            function spamStart () {
                if (!spamId) {
                   spamId = setInterval(() => {
                       if (i === 2) spamBreak();
                       bot.sendMessage(chatId, 'bla');
                        i++;
                    }, 2000);
                }
            }

            function spamBreak () {
                clearInterval(spamId);
                return bot.sendMessage(chatId, 'the end');
            }

            spamStart();

            return;
    }


    if (text === '/game') {
        return startGame(chatId);
    }

    return bot.sendMessage(chatId, `I can't execute this command`);
});

bot.on('callback_query', async msg => {
    const { data } = msg;
    const chatId = msg.message.chat.id;

    if (data === '/again') {
        return startGame(chatId);
    }

    if (data === chats[chatId]) {
        return await bot.sendMessage(chatId, 'Yeah! You won!', againOptions)
    } else {
        return bot.sendMessage(chatId, `Unfortunately you lost, bot meant number ${chats[chatId]}`, againOptions);
    }
});