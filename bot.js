const mineflayer = require('mineflayer');

/*
========================
CONFIG
========================
*/

const CONFIG = {

    // IP server
    host: 'neltramc.pikz.online',

    // Port server
    port: 25632,
    // Version minecraft
    version: '1.21.4',

    // Password auth plugin
    password: '123456',

    // Số bot test (nên thấp)
    botCount: 1000,

    // Tên bot
    botPrefix: 'Theanh',

    // Delay join từng bot
    joinDelay: 5000,

    // Delay reconnect
    reconnectDelay: 15000,

    // Có auto move không
    move: true
};

/*
========================
BOT FUNCTION
========================
*/

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createBot(id) {

    const username = `${CONFIG.botPrefix}${id}`;

    const bot = mineflayer.createBot({
        host: CONFIG.host,
        port: CONFIG.port,
        username,
        version: CONFIG.version,
        auth: 'offline',
        hideErrors: false
    });

    console.log(`[+] ${username} connecting`);

    bot.on('login', () => {
        console.log(`[LOGIN] ${username}`);
    });

    bot.once('spawn', () => {

        console.log(`[SPAWN] ${username}`);

        // register
        setTimeout(() => {
            bot.chat(`/register ${CONFIG.password} ${CONFIG.password}`);
        }, 3000);

        // login
        setTimeout(() => {
            bot.chat(`/login ${CONFIG.password}`);
        }, 6000);

        // move random
        if (CONFIG.move) {

            setInterval(() => {

                if (!bot.entity) return;

                const actions = [
                    'forward',
                    'back',
                    'left',
                    'right',
                    'jump'
                ];

                const action =
                    actions[random(0, actions.length - 1)];

                bot.setControlState(action, true);

                setTimeout(() => {
                    bot.setControlState(action, false);
                }, 1000);

            }, random(10000, 20000));

        }

    });

    bot.on('messagestr', (msg) => {
        console.log(`[CHAT] ${username}: ${msg}`);
    });

    bot.on('kicked', (reason) => {
        console.log(`[KICKED] ${username}`);
        console.log(reason);
    });

    bot.on('end', () => {

        console.log(`[RECONNECT] ${username}`);

        setTimeout(() => {
            createBot(id);
        }, CONFIG.reconnectDelay);

    });

    bot.on('error', (err) => {
        console.log(`[ERROR] ${username}: ${err.message}`);
    });
}

/*
========================
START BOTS
========================
*/

for (let i = 1; i <= CONFIG.botCount; i++) {

    setTimeout(() => {
        createBot(i);
    }, i * CONFIG.joinDelay);

}