const fs = require('fs');
const chokidar = require('chokidar');
const HashTable = require('./hashtable');
const { EventEmitter } = require('events');

class VFS extends EventEmitter{
    constructor(vfsPath){
        super();
        this.vfs = vfsPath;
    }

    run(){
        const hashtable = new HashTable();
        const vfs = this.vfs;

        if(!fs.existsSync(vfs)) fs.mkdirSync(vfs);
        console.log(`VFS running on\t${vfs}`);

        chokidar.watch(vfs)
        .on('add', (filename) =>{
            if(filename.includes('crdownload')) return;

            if(!hashtable.find(filename)) hashtable.createNode(filename);

            hashtable.setNode(filename, 'add', true);
            // console.log(`CREATE\t${hashtable.key(filename)}`);

        })
        .on('change', (filename) =>{
            if(!hashtable.find(filename)) hashtable.createNode(filename);

            hashtable.setNode(filename, 'update', true);
            // console.log(`UPDATE\t${hashtable.key(filename)}`);

            const flags = hashtable.find(filename);
            const { add, update } = flags;

            const file = fs.readFileSync(filename);
            fs.unlinkSync(filename);
            
            if(add && update) this.emit('download', file);

        })
        .on('unlink', (filename) =>{
            if(filename.includes('crdownload')) return;

            if(hashtable.find(filename)) hashtable.removeNode(filename);
            // console.log(`DELETE\t${hashtable.key(filename)}`);
        })
        .on('error', e => this.emit('error', e))  
    }
}

module.exports = VFS;