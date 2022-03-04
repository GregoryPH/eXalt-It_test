#!/usr/bin/env node

async function getDataFromEndpoint(url) {
    const fetch = require('node-fetch');
    let settings = { method: "Get" };

    let data = await fetch(url, settings)
        .then(res => res.json())
        .then((json) => {
            return json
        });
    
    return (data);
}

function pascalCase(word) {
    upper = word.slice(0, 1).toUpperCase();
    lower = word.slice(1).toLowerCase();
    word = upper + lower
    return word
}

function cleanName(name) {
    name = name.replace(/3/g, 'e');
    name = name.replace(/4/g, 'a');
    name = name.replace(/1/g, 'i');
    name = name.replace(/0/g, 'o');
    return pascalCase(name);
}

function cleanDetail(firstWord, newWord, type){
    if (type == 'name') {
        if (firstWord != '#ERROR' && firstWord != '')
            return cleanName(firstWord);
        else if (newWord != '#ERROR')
            return cleanName(newWord);
    }

    if (type == 'city')
        return pascalCase(newWord);

    return newWord
}

function mergeTables(finalTable, newTable) {
    for (let key in newTable) {
        for (let type in newTable[key]) {
            if (key in finalTable == false)
                finalTable[key] = {}
            if (finalTable[key][type])
                finalTable[key][type] = cleanDetail(finalTable[key][type], newTable[key][type], type);
            else
                finalTable[key][type] = cleanDetail('', newTable[key][type], type);
        }
    }
    return finalTable
}

async function main() {

    var finalTable = await getDataFromEndpoint('https://recrutement-practice-default-rtdb.firebaseio.com/users.json')
    finalTable = mergeTables({}, finalTable);
    var newTable = await getDataFromEndpoint('https://recrutement-practice-default-rtdb.firebaseio.com/jobs.json')
    finalTable = mergeTables(finalTable, newTable);
    newTable = await getDataFromEndpoint('https://recrutement-practice-default-rtdb.firebaseio.com/informations.json')
    finalTable = mergeTables(finalTable, newTable);
    console.log(finalTable)
}

if (require.main === module) {
    main();
}
