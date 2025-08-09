let config = {
    //Interval sync in ms
        intervalSyncTime: 5000,

    //Resources
        wood:  35,
        stone: 15,
        coins: 0,

    //Progression exp lvl
        playerLvl: 1,
        expPerResearch: 1,
        expBase: 4,
        expMult: 1,
        expExpo: 0.3,
        basePassiveSkillPoints: 0, //tree

    //Research tree
        treeRows: 9,
        treeColumns: 5,

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
        albumRows: 5,
        albumColumns: 2,

    //Testing
        rClickEvent: false,

    //Automate
        totalMarketPacks: 5
}

if(1 === 1){
        //Resources
        config.wood =  999,
        config.stone = 999,
        config.coins = 999,
        config.basePassiveSkillPoints = 999 //tree

}