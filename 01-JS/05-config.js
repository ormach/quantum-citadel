let config = {

    //Starting coins
        coins: 200,

    //Progression exp lvl
        playerLvl: 1,
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
        rewardsValue: 85,
    
        cardsToStartQuest: 4,

    //Collection
        albumRows: 3,
        albumColumns: 4,

    //Testing
        rClickEvent: false,

    //Automate
        totalMarketPacks: 5
}

if(1 === 1){
        config.coins = 950
}