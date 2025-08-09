//GAME & UI
    class Game {
        constructor(){
            //Store per game section, place in LS and build board state from this obj.
            this.plObj = new PlayerObj()

            this.cards = [] //Stores all card objects
            this.cardsRef = []
            this.collection = new Collection
            this.totalReward = config.rewardsValue

            this.inspectionTable = new InspectionTable()
            this.sellArea = new SellArea()

            this.gameMap = new GameMap()

            //Skill tree
            this.treeObj = {}

            console.log('Generating new game obj.')
        }

        saveGame(){
            console.log("---> GAME SAVED");
            localStorage.setItem('gameData', JSON.stringify(g))
        }

        //Check if game state available and override stuff
        loadGame(){
            let data = localStorage.getItem('gameData')

            //Load game
            if(typeof data === 'string'){
                console.log('<--- GAME LOADED');
    
                //Store loaded data
                g.ref = JSON.parse(data)

                //Override game values?
                g.ref.cards.forEach(card => {                    
                    new Card({
                        "location": card.location, 
                        "mode": "regen",
                        "cardObj": card
                    })
                })

                //Override values of new objects !!! 
                //DON'T do g.plObj = g.ref.plObj it removes methods.
                g.plObj.resources = g.ref.plObj.resources
                
                g.plObj.exp       = g.ref.plObj.exp
                g.plObj.lvl       = g.ref.plObj.lvl
                g.plObj.treeNodes = g.ref.plObj.treeNodes
                g.totalReward     = g.ref.totalReward
                g.cardsRef        = g.ref.cardsRef //Load card ref to keep card frequency ranges
                g.treeObj         = g.ref.treeObj //Load tech tree

                //Load map decorations
                g.gameMap.envDecorations = g.ref.gameMap.envDecorations

                //Load buildings
                for(let building in g.ref.gameMap.buildings){
                    // console.log(g.ref.gameMap.buildings[building])
                    g.gameMap.build(g.ref.gameMap.buildings[building].buildingType, g.ref.gameMap.buildings[building])
                }

                //Load env tree sprites
                for (let key in g.ref.gameMap.environmentObjects){
                    new Tree(key, g.ref.gameMap.environmentObjects[key])
                }
                


                //TIME: Load time, it's not added in constructor
                this.rewardTime = g.ref.rewardTime //Coins
                this.treeIntervalStartTime = g.ref.treeIntervalStartTime //Trees
                // console.log(`Game: Reward time loaded: ${this.treeIntervalStartTime}`);



                //Check interval reward
                this.enableRewardButton()

                //Load previous research 
                g.research = new Research(g.ref.research.contractCard)
                //Load card pool for card frequency roll calculation
                g.research.researchCardPool = g.ref.research.researchCardPool 
            }

            //New game
            else{
                console.log('Game: No saved game found.');
                


                //TIME: Save the game initiation time for reward calc
                this.rewardTime = Date.now()       //Coins
                this.treeIntervalStartTime = Date.now() //Trees



                //New research
                g.research = new Research

                //Prebuild buildings once at the start of a new game
                prebuiltBuildingsRef.forEach(building => {
                    let newBuildingRef = buildingsRef[building.type]
                    newBuildingRef.x = building.x //Set x coord from ref

                    g.gameMap.build(building.type, newBuildingRef)
                    // genBuildingHtmlElem(newBuildingRef, "load")
                })
            }
        }

        enableRewardButton(){
            
            //Enable reward button: Previous load date - New load date
            if(Date.now() - g.rewardTime > config.rewardInterval){
                
                //Enable reward button
                el('reward-btn').removeAttribute("disabled")
                
                //Change button label
                el('reward-timer').innerHTML = `Get reward (${this.totalReward}c)`

                //Disable timer
                config.runTimer = false

            }

            //Return time until reward
            return Math.floor((config.rewardInterval -  (Date.now() - g.rewardTime)) / 1000)
        }

        getReward(){
            //Add coins to player
            this.plObj.changeResource('coins', this.totalReward)

            //Display alert
            showAlert(`Daily reward! You get ${this.totalReward} coins.`)

            //TIME: Update coin timer
            this.rewardTime = Date.now()

            //Disable button
            el('reward-btn').setAttribute("disabled","")

            //Enable timer
            config.runTimer = true
        }

        //Calculate reward value
        calculateReward(){
            this.totalReward = config.rewardsValue

            g.cards.forEach(card =>{
                if(!card.location.includes("page")) return

                if(card.rarity === "rare"){
                    this.totalReward += 1
                }
                else if (card.rarity === "epic"){
                    this.totalReward += 5        
                }
                else if (card.rarity === "legendary"){
                    this.totalReward += 10
                }
                else if (card.rarity === "set"){
                    this.totalReward += 15
                }
            })

            // console.log("Calculated reward value");
            
        }

        //Creates card elements
        genCard(args){

            let dropChance = args.number * 20
            let relicQuant = 0

            for(let i = 0; i < args.number; i++){

                let dropRoll = rng(100)

                if(dropRoll < dropChance){
                    new Card(args)
                    relicQuant++
                }
            }

            showAlert(`You discovered: ${relicQuant} relic(s).`)
        }

        //Creates card slot elements for the game board
        genCardSlot(locationId, slotQuantity){

            for(let i = 0; i < slotQuantity; i++){
                let slot = document.createElement('div')

                slot.id = locationId + '_slot-' + i
                
                slot.classList = 'card-container'
                slot.setAttribute('ondrop','drop(event)')
                slot.setAttribute('ondragover', 'allowDrop(event)')

                // console.log(locationId);

                el(locationId).append(slot)
            }

        }

    }

//PLAYER & BUY/PAY
    class PlayerObj{
        
        constructor(){
            this.resources = {
                "coins": config.coins || 0,
                "stone": config.stone || 0,
                "wood":  config.wood  || 0,
            }
            this.exp = 0
            this.lvl = config.playerLvl
            this.lvlUpExp = Math.ceil(config.expBase * (this.lvl * config.expMult) ** config.expExpo)
            // this.coinsCap = config.coinsCap

            //Tree
            this.treeNodes      = []
            this.treePoints     = config.basePassiveSkillPoints
        }

        //Pay for something
        pay(operation, type){
            //Pack
            if (operation === 'pack'){
                // let totalCost = config.cardCost * config.cardsInPack
                let totalCost = 3
                let resource = 'stone'
                
                if(this.enoughResource(resource, totalCost)){
                    this.changeResource(resource, -Math.abs(totalCost))

                    g.genCard({
                        // "number": config.cardsInPack,
                        "number": totalCost,
                        "location": `collection`,
                        "setName": type,
                    })
                }
            }
            //Inspect
            else if(operation === 'inspect'){

                let totalCost = config.inspectionCost
                let resource = 'coins'

                if(this.enoughResource(resource, totalCost)){
                    this.changeResource(resource, -Math.abs(totalCost))
                    g.inspectionTable.inspect()
                }
            }
            //Skip
            else if (operation === 'skip research'){

                let totalCost = config.researchSkip
                let resource = 'coins'

                if(this.enoughResource(resource, totalCost)){
                    this.changeResource(resource, -Math.abs(totalCost))
                    g.research = new Research
                }
            }
            //Build
            else if (operation === 'build'){

                let enoughResources
                let refObj = buildingsRef[type];

                // console.log(refObj)

                resourcesRef.forEach(res => {
                    let resValue = refObj[`cost${upp(res)}`] * 1

                    if(this.enoughResource(res, resValue) !== true) {
                        enoughResources = false
                        return
                    }

                    this.changeResource(res, -Math.abs(resValue))
                })

                if(enoughResources !== false){
                    g.gameMap.build(type)
                }
            }

            g.saveGame()
        }

        //Check if player has resources to pay
        enoughResource(resource, cost){
            if(this.resources[resource] >= cost){
                return true
            }
            else{
                showAlert(`Not enough ${resource}. Need ${cost} ${resource}.`)
                return false
            }
        }

        changeResource(resource, value){
            if(this.resources[resource] !== undefined){
                this.resources[resource] += value
            }
            else{
                console.warn(`Resource ${resource} not found in player resources.`)
            }
            updateUI()
        }

        gainExp(val){

            this.exp += val

            //Lvl up
            if(this.exp >= this.lvlUpExp){
                this.levelUp()
            }

            g.saveGame()
            updateUI()
        }

        levelUp(){

            this.lvl++
            // g.market.genPage() //Updates button labels based on pl lvl
        
            //Reduce exp by elp required to lvl up
            this.exp = this.exp - this.lvlUpExp
        
            //Calculate exp required for the next level
            this.lvlUpExp = Math.ceil(config.expBase * (this.lvl * config.expMult) ** config.expExpo)
        
            //Check exp to see if more than 1 level was gained
            this.gainExp(0)

            this.treePoints++
        }
    }