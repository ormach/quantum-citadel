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

let prebuiltBuildingsRef = [
    // {
    //     type: 'builders',
    //     x: 55,
    //     y: 6,
    // },
    // {
    //     type: 'research',
    //     x: 45,
    //     y: 5,
    // },
]

//Stores all types of environment decorations
let envDecorationsRef = {
    sky: {
        sprites: {
            cloud: {id: 'cloud', quantity: 3, flipXPercentChance: 50, spacing:[5,0], animationDuration: [600000, 500000]},
            // celestial: {id: 'celestial', quantity: 1},
        },
        elementQuantity: [5,3],
        absoluteCoords: [
            {x: "10%", y: "30%"},
            {x: "35%", y: "25%"},
            {x: "55%", y: "20%"},
            {x: "85%", y: "30%"},
            {x: "100%", y: "30%"},
        ],
    },
    animals: {
        sprites: {
            bird: {
                id: 'bird',
                quantity: 1,
                animation: true, spacingY:[40,25],
                spacing:[100,0],
                speed: 3
            },
        },
        elementQuantity: [40,24]
    },
    groundS: {
        sprites: {
            grass: {
                id: 'grass',
                quantity: 5,
                flipXPercentChance: 50,
                spacing:[20,0],
                permanent: true,
            },
            flower: {
                id: 'flower',
                quantity: 4,
                flipXPercentChance: 50,
                spacing:[20,0],
                permanent: true,
            },
        },
        elementQuantity: [20,10]
    },
    groundM: {
        sprites: {
            tree: {
                id: 'tree',
                quantity: 2,
                flipXPercentChance: 50,
                spacing:[20,0],
                permanent: true,
            },
            treeWinter: {
                id: 'treeWinter',
                quantity: 3,
                flipXPercentChance: 50,
                spacing:[20,0],
                permanent: true,
            },
            bush: {
                id: 'bush',
                quantity: 2,
                flipXPercentChance: 50,
                spacing:[20,0],
                permanent: true,
            },
        },
        elementQuantity: [10,10]
    },
    landscape: {
        sprites: {
            valley: {
                id: 'valley',
                quantity: 3,
                spacing:[5,0],
                permanent: true,
            },
            hill: {
                id: 'hill',
                quantity: 3,
                spacing:[5,0],
                permanent: true,
            },
        },
        elementQuantity: [3,3]
    },
}

let modalsRef = {
    archeologist:{id: 'archeologist'},
    mine:{id: 'mine'},
    research:{id: 'research'},
    builders:{id: 'builders'},
    demolishers:{id: 'demolishers'},
}