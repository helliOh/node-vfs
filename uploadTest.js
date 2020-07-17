const fs = require('fs');

let buffer = [];

for(let i=0; i<0xffffff; i++) buffer.push(i);

fs.writeFileSync('./vfs/dummy', Buffer.from(buffer));
