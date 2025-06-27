let cardRarityRef = ['common', 'rare', 'epic', 'legendary', 'set']
let packsRef = [
    {
        name:"objects",
        packId:"objects",
        lvlRequirement: 0,
        lvlUnlockResearch: 2,
    },
    {
        name:"gravitation",
        packId:"gravitation",
        lvlRequirement: 3,
        lvlUnlockResearch: 5,
    },
    {
        name:"planetary motion",
        packId:"pl-motion",
        lvlRequirement: 6,
        lvlUnlockResearch: 8,
    },
    {
        name:"energy",
        packId:"energy",
        lvlRequirement: 9,
        lvlUnlockResearch: 11,
    },
    {
        name:"electricity",
        packId:"electricity",
        lvlRequirement: 12,
        lvlUnlockResearch: 14,
    }
]

let buildingsRef = {
    house: {
        description: "Provides 1 worker in exchange for 1 food per day",
        durability: 5,
        cost: 12,
        time: 30,
        width: 24,
        height: 48,
    },
    farm: {
        description: "Provides 1 food per day",
        durability: 5,
        cost: 12,
        time: 30,
        width: 48,
        height: 24,
    },
    tower: {
        description: "Blocks intruders and provides protection for other buildings.",
        durability: 50,
        cost: 100,
        time: 60,
        width: 48,
        height: 48,
    },
    storage: {
        description: "Stores relics and resources.",
        durability: 10,
        cost: 100,
        time: 60,
        width: 120,
        height: 72,
    },
    mine: {
        description: "Provides relics and resources per time interval.",
        durability: 10,
        cost: 100,
        time: 60,
        width: 72,
        height: 72,
    },
    library: {
        description: "Provides access to research..",
        durability: 10,
        cost: 100,
        time: 60,
        width: 120,
        height: 72,
    },
    builders: {
        description: "Allows to build buildings.",
        durability: 10,
        cost: 100,
        time: 60,
        width: 72,
        height: 72,
    },
}