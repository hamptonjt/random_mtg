const mtg = require('mtgsdk')

const randNum = Math.floor((Math.random() * 5000) + 1) 

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

//console.log('Random Number generated:', randNum)
readline.question('Do you wish to search for a card or set? ', (searchVal) => {
    if (searchVal.toLowerCase() === 'card') {
        readline.question('What is the name of the card? ', (cardSearch) => {
            mtg.card.where({name: cardSearch}).then(cards => {
                console.log(cards.length)
                for (var card of cards) {
                    console.log(card)
                }
                readline.close()
            })
        })
    } else if (searchVal.toLowerCase() === 'set') {
        readline.question('What is the name of the set? ', (setSearch) => {
            mtg.set.where({name: setSearch}).then(sets => {
                console.log(sets.length)
                for (var set of sets) {
                    console.log(set)
                }
                readline.close()
            })
        })
    }
})
