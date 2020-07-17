class HashTable{
    constructor(){
        this.table = {}

        const today = (new Date()).valueOf().toString();
        const random = Math.random().toString();
        const code = Buffer.from(today + random).toString('base64');

        const secret = require('crypto')
        .createHmac('sha256', code)
        .update(code + code)
        .digest('hex');

        this.secret = secret;
    }

    key(data){
        return require('crypto').createHmac('sha256', this.secret).update(data).digest('hex');
    }

    find(data){
        const key = require('crypto').createHmac('sha256', this.secret).update(data).digest('hex');
        return this.table[key];
    }

    setNode(data, attribute, value){
        const key = require('crypto').createHmac('sha256', this.secret).update(data).digest('hex');
        if(attribute != 'name', attribute != 'add' && attribute != 'update') throw new Error('Invalid attribute');
        this.table[key][attribute] = value;
        return this.table[key][attribute];
    }

    createNode(data){
        const key = require('crypto').createHmac('sha256', this.secret).update(data).digest('hex');
        if(this.table[key]) throw new Error('Duplicate node create');
        this.table[key] = { name : data, add : false, update : false };
    }

    removeNode(data){
        const key = require('crypto').createHmac('sha256', this.secret).update(data).digest('hex');
        if(this.table[key]) delete this.table[key];
    }
}

module.exports = HashTable;