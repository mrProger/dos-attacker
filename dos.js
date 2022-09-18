const request = require('request');
var debug = false;

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function sendGet(link) {
    if (debug === "true") {
        console.log(`Метод: GET; Маршрут: ${link}`);
    }

    setTimeout(() => request(link, function(error, response, body) {
        if (error !== null) {
            console.log(error);
        }
    }), 500);

    return true;
}

function sendPost(link, data) {
    data = data === undefined ? JSON.stringify({ "value": "null" }) : data;

    if (debug === "true") {
        console.log(`Метод: POST; Маршрут: ${link}`);
    }

    setTimeout(() => request.post({
        url: link,
        body: !isJson(data) ? JSON.stringify(data) : data,
        json: true
    }, function(error, response, body) {
        if (error !== null) {
            console.log(error);
        }
    }), 500);

    return true;
}

function run(link, count, method) {
    let json = null;

    if (link.startsWith('http://') || link.startsWith('https://')) {
        for (let i = 0; i < count; i++) {
            if (method.toLowerCase() === "get") {
                sendGet(link);
            } else if (method.toLowerCase() === "post") {
                sendPost(link, undefined);
            }
        }
    } else if (link.endsWith('.json')) {
        json = require(link);
        let links = json["links"];

        for (let i = 0; i < count; i++) {
            if (Array.isArray(links)) {
                for (let j = 0; j < links.length; j++) {
                    let rand = getRandomInt(links.length);
                    if (links[rand].startsWith('http://') || links[rand].startsWith('https://')) {
                        if (method.toLowerCase() === "get") {
                            sendGet(links[rand]);
                        } else if (method.toLowerCase() === "post") {
                            sendPost(links[rand], undefined);
                        }
                    }
                    rand = null;
                }
            } else {
                if (links.startsWith('http://') || links.startsWith('https://')) {
                    if (method.toLowerCase() === "get") {
                        sendGet(links);
                    } else if (method.toLowerCase() === "post") {
                        sendPost(links, undefined);
                    }
                }
            }
        }
    }
}

// 1 - Ссылка, либо путь до JSON с ссылками; 2 - Количество; 3 - Метод; 4 - debug(true или false)
if (process.argv.length == 6) {
    let arg = process.argv[5].toLowerCase();
    debug = arg === "true" || arg === "false" ? arg : "false";
    arg = null;
    run(process.argv[2], process.argv[3], process.argv[4]);
}