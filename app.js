const VFS = require('./vfs');
const path = require('path');

let vfs = new VFS(path.join(__dirname, 'vfs'))

vfs
.on('download', (file) => console.log(file));

vfs.run();