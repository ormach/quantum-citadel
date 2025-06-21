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
        cost: 12,
        time: 30,
        width: 24,
        height: 48,
    },
    tower: {
        cost: 100,
        time: 60,
        width: 48,
        height: 48,
    },
    storage: {
        cost: 100,
        time: 60,
        width: 120,
        height: 72,
    },
    mine: {
        cost: 100,
        time: 60,
        width: 72,
        height: 72,
    },
    library: {
        cost: 100,
        time: 60,
        width: 120,
        height: 72,
    },
    builders: {
        cost: 100,
        time: 60,
        width: 72,
        height: 72,
    },
}