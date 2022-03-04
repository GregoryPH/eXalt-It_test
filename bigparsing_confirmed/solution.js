#!/usr/bin/env node

class StockValue {
    #openBraces = 0;
    #buffer = "";
    #searchedId = 0;

    setSearchedId(id) {
        this.#searchedId = id;
    }

    checkName() {
        if (this.#buffer[this.#buffer.length - 1] == ',')
            this.#buffer = this.#buffer.slice(0, -1);
        const obj = JSON.parse(this.#buffer)
        if (obj["id"] == this.#searchedId)
            console.log(obj["name"]);
    }

    bufferLine(line) {
        if (line.includes('{')) 
            this.#openBraces += 1;
        if (this.#openBraces > 0)
            this.#buffer += line;
        if (line.includes('}')) {
            this.#openBraces -= 1;
            if (this.#openBraces == 0) {
                this.checkName()
                this.#buffer = "";
            }
        }
    }    
}

function main() {
    const fs = require('fs');
    const readline = require('readline');

    const stockValue = new StockValue;
    stockValue.setSearchedId(process.argv[2])
    const fileStream = fs.createReadStream('input.json');
    const read = readline.createInterface(fileStream)
    read.on('line', function (line) {
        stockValue.bufferLine(line);
    })
}

if (require.main === module) {
    main();
}
