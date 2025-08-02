//START GAME
let g

//Required here due to fetch
let cardsRef 
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


    //Parse building resources
    convertResources()
    
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
    console.log('Saving game on start.');
    g.saveGame()
}

//INTERVAL SYNC: Runs every second.
function intervalSync(){
    //STONE:
    //Update mine sprite based on timers
    let mines = document.querySelectorAll('div[type="mine"]');
    mines.forEach(mine => {

        let mineSprite = mine.childNodes[1].childNodes[1]

        if(Date.now() - g.gameMap.buildings[mine.id].eventTime >= config.stoneSpawnInterval){
            mineSprite.classList.remove('emptyMine')
        }
    })


    //TREES:
    // Get time diff between now and last event or game start
    let treeTimeDifference = Date.now() - g.treeIntervalStartTime

    //If diff is greater than treeSpawnInterval, and there are less trees than treeCap
    if(
        treeTimeDifference >= config.treeSpawnInterval
    ){
        //Set treeIntervalStartTime to now
        g.treeIntervalStartTime = Date.now()

        //Define current number of trees
        let currentTreeCount = 0
        if(el('.tree-sprite', 'all') !== null){
            // console.log('TREE-1: Tree sprites found.')
            currentTreeCount = el('.tree-sprite', 'all').length
        }

        if(currentTreeCount >= config.treeCap) {
            // console.log('TREE-2:Tree cap reached.')
            return
        }


        //Add tree equal to diff/treeSpawnInterval
        let treesToAdd = Math.round(treeTimeDifference / config.treeSpawnInterval)
        // console.log(`TREE-3: Trees to add: ${treesToAdd}, current tree count: ${currentTreeCount}.`)


        //If there are more trees than treeCap - current trees, set value to the difference
        if(treesToAdd + currentTreeCount > config.treeCap){
            treesToAdd = config.treeCap - currentTreeCount
        }

        for (let i = 0; i < treesToAdd; i++) {
            // console.log(`TREE-4: Tree added.`);
            new Tree()
        }

        //Save if tree was added
        console.log('Saving game on interval sync.');
        g.saveGame()
    }


    //COINS reward:
    // Check for interval coin reward
    let remainingTime = g.enableRewardButton()

    //Stop timer if reward is available, has to be here due to label update
    if(!config.runTimer) return

    //Convert seconds to hh:mm:ss format for UI indicator
    let convertTime = new Date(remainingTime * 1000).toISOString().slice(11,19);

    //Display remaining time in UI
    el('reward-timer').innerHTML = `${g.totalReward}c in ${convertTime}`


    // Saves reward timer and reward button state every sec
    g.saveGame()
}


// LOAD GAME DATA
Promise.all([
    fetch('./04-DATA/q-citadel - Relics.csv').then(response => response.text()),
    fetch('./04-DATA/q-citadel - Buildings.csv').then(response => response.text())
])
    .then(([cardsData, secondData]) => {
        cardsRef = JSON.parse(csvJSON(cardsData));
        buildingsRef = JSON.parse(csvJSON(secondData));
        return { cardsRef, buildingsRef };
    })
    .then(() => startGame())
    .catch(error => console.error('Error:', error));