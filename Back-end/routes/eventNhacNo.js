const eventEmitter = require('eventemitter3');
const emitter = new eventEmitter();

var subscribeEvent = (req, res, event) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    var heartBeat = setInterval(() => {
        res.write('\n');
    }, 15000);

    var handler = data => {
        const userId = Number(data.idTaiKhoanNo);
        if(Number(res.locals.token.userId) === userId) {
            var json = JSON.stringify(data);
            res.write(`retry: 500\n`);
            res.write(`event: ${event}\n`);
            res.write(`data: ${json}\n`);
            res.write(`\n`);
        }
        
    }
    
    emitter.on(event, handler);

    //console.log(emitter.rawListeners(event));

    req.on('close', () => {
        clearInterval(heartBeat);
        emitter.removeListener(event, handler);
    });
}

//
// event pub-sub

var NHACNO_ADDED = 'NHACNO_ADDED';

var subscribeNhacNoAdded = (req, res) => {
    subscribeEvent(req, res, NHACNO_ADDED);
}

var publishNhacNoAdded = nhacNoObj => {
    emitter.emit(NHACNO_ADDED, nhacNoObj);
}

module.exports = {
    subscribeNhacNoAdded,
    publishNhacNoAdded
}