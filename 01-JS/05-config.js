let config = {

    //Resources
        coins: 500,
        stone: 500,
        wood:  500,

    //Progression exp lvl
        playerLvl: 12,
        expPerResearch: 1,
        expBase: 4,
        expMult: 1,
        expExpo: 0.3,

    //Costs
        cardCost:       20,
        inspectionCost: 5,
        researchReward: 25,
        researchSkip: 10,
        cardsInPack: 4,
    
    //Coin reward per second (off)
        coinInc: 1,

    //Coin reward per time
        rewardInterval: 60 * 60, //N x 1min
        runTimer: true,
        rewardsValue: 3,
    
        cardsToStartQuest: 4,
    
//TREES: spawn frequency
        treeSpawnInterval: 10000, //Interval in ms
        treeCap: 10,
//STONE
        stoneSpawnInterval: 3000,


    //Collection
        albumRows: 3,
        albumColumns: 4,

    //Testing
        rClickEvent: false,

    //Automate
        totalMarketPacks: 5
}

if(1 === 2){
        config.coins = 500
}