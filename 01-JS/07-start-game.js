//START GAME
let g //global game variable
let cardsRef //required due to fetch
let buildingsRef

function startGame(){
    g = new Game

    //New collection
    g.collection.genSlots()
    
    //Remove draft cards from the pool & add cards to game obj
    for (let key in cardsRef){
        if(cardsRef[key].export === "y"){
            g.cardsRef.push(cardsRef[key])
        }
    }

    cardsRef = g.cardsRef
    
    g.market = new Market
    g.market.genPage()

    //Generate UI
    generateUI()

    //Load/generate game
    g.loadGame()
    updateUI()

    //Generate map decoration elements after g is assigned
    g.gameMap.setMapDecoration()
    
    //Interval sync
    setInterval(intervalSync, 1000)

    //Save game on start
    //Save was not set, don't remember why
    g.saveGame()
}

//INTERVAL SYNC (not used atm)
//g per sec
function intervalSync(){
    //Chek for interval coin reward
    let remainingTime = g.enableRewardButton()

    //Stop timer if reward is available, has to be here due to label update
    if(!config.runTimer) return

    //Converst seconds to hh:mm:ss format
    let convertTime = new Date(remainingTime * 1000).toISOString().slice(11,19);

    el('reward-timer').innerHTML = `${g.totalReward}c in ${convertTime}`

    // Saves reward timer and reward button state every sec
    g.saveGame()
}


// LOAD GAME DATA

Promise.all([
    fetch('./04-DATA/library game cards [2024] - Sheet1.csv').then(response => response.text()),
    fetch('./04-DATA/q-citadel - Buildings.csv').then(response => response.text())
])
    .then(([cardsData, secondData]) => {
        cardsRef = JSON.parse(csvJSON(cardsData));
        buildingsRef = JSON.parse(csvJSON(secondData)); // Store your second data
        return { cardsRef, buildingsRef };
    })
    .then(() => startGame())
    .catch(error => console.error('Error:', error));