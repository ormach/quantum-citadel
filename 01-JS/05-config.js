let config = {
    //Interval sync in ms
        intervalSyncTime: 5000,

    //Resources
        wood:  500,
        stone: 500,
        coins: 500,

    //Progression exp lvl
        playerLvl: 12,
        expPerResearch: 1,
        expBase: 4,
        expMult: 1,
        expExpo: 0.3,
        basePassieSkillPoints: 10, //tree

    //Costs
        cardCost:       20,
        inspectionCost: 5,
        researchReward: 25,
        researchSkip: 10,
        cardsInPack: 4,
        mineCostScaleBase: 20,

    //Coin reward per second (off)
        coinInc: 1,

    //Coin reward per time
        rewardInterval: 50000, //N x 1min
        runTimer: true,
        rewardsValue: 3,
    
        cardsToStartQuest: 4,
    
//TREES: spawn frequency
        treeSpawnInterval: 10000, //Interval in ms
        treeCap: 10,
//STONE
        stoneSpawnInterval: 5000,


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