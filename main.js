//Drag and drop 
//Requires any ID for draggable elem
    let draggedCard
    let overlappingCard
    let targetContainer

    function allowDrop(ev) {
        ev.preventDefault();
    }
    //Drag card
    function drag(ev) {
        //Record dragged card
        draggedCard = ev.target //logs picked card

        //Records dragged card (records id)
        // ev.dataTransfer.setData("text/plain", ev.target.id);

        //Make all cards not interactable?
    }
    //Drop card
    function drop(ev) {
        ev.preventDefault();

        //Get data from drag() function (transefrs id)
        // var data = ev.dataTransfer.getData("text/plain");

        //Record target elem
        
        //If card
        if(ev.target.classList.contains('card')){
            overlappingCard = ev.target
            targetContainer = ev.target.parentNode
            // ev.target.parentNode.insertBefore(document.getElementById(data), ev.target);
        }
        //If elem in card
        else if (ev.target.parentNode.classList.contains('card')){
            overlappingCard = ev.target.parentNode
            targetContainer = ev.target.parentNode.parentNode
        }
        else{
            targetContainer = ev.target
        }
        
        //Add card to container
        targetContainer.appendChild(draggedCard);

        //Do stuff on card placement
        //Update card location
        findByProperty(g.cards, 'cardId', draggedCard.id).location = targetContainer.id

        //Save game on card movement
        g.saveGame()

        // console.log(
        //     findByProperty(g.cards, 'cardId', draggedCard.id)
        // );   
    }
    

//UI
//Manage pages
    function viewScreen(page){
      let pages = document.getElementById('wrapper').querySelectorAll('.page')

      pages.forEach(page => {
          page.classList.add('hide')
      })

      el(page).classList.remove('hide')
    }

    //Show Nav
    function toggleNav(){
        el('nav').classList.toggle('hide')
    }


//GAME
    class Game {
        constructor(){
            //Storge per game section, place in LS and build board state from this obj.
            this.plObj = new PlayerObj()
            this.cards = [] //Stores all card objects
            this.inspectionTable = new InspectionTable()
            this.collection = new Collection
        }

        saveGame(){
            localStorage.setItem('gameData', JSON.stringify(g))
        }

        //Check if game state available and override stuff
        loadGame(){
            let data = localStorage.getItem('gameData')
    
            if(typeof data === 'string'){
                console.log('Game: Game loaded.');
    
                //Store loaded data
                g.ref = JSON.parse(data)
    
                //Override game values?
            }
            else{
                console.log('Game: No saved game found.');
                return false
            }
        }

        //Regen html based on game state
        updateUI(){
            el('coin-indicator').innerHTML = `${g.plObj.coins}`
    
            //Allocate cards
            g.cards.forEach(card => {
                let cardElem = card.genHtml()
                console.log(cardElem);
                
            })
        }

        //Creates card elements
        genCard(number, locationId, name){
            for(let i = 0; i < number; i++){
                let card

                //Generate card object
                //Generate by name
                if(name != undefined){
                    card = new Card(name) 

                //If no name generate random               
                } else {
                    card = new Card(rarr(cardsRef).name)
                }

                //Generate html element                
                let cardElem = card.genHtml()
                card.location = locationId

                //If you add to hand, add to the start of the row
                if(locationId === 'hand'){
                    el(locationId).insertBefore(cardElem, el(locationId).firstChild)
                }
                //Else add to slot
                else{
                    el(locationId).append(cardElem)
                }                
            }
        }

        //Creates card slot elements for the game board
        genCardSlot(locationId, slotQuantity){
            for(let i = 0; i < slotQuantity; i++){
                let slot = document.createElement('div')

                slot.id = locationId + '-slot' + i
                
                slot.classList = 'card-container'
                slot.setAttribute('ondrop','drop(event)')
                slot.setAttribute('ondragover', 'allowDrop(event)')

                // console.log(locationId);

                el(locationId).append(slot)
                //Gen slot elem
                //Add to container
            }
        }

    }


//CARD
    class Card {
        constructor(cardName, mode){

            let cardRefObj = findByProperty(cardsRef, 'name', cardName)            
            // console.log(cardRefObj);
            

            this.cardId = genId('cr')
            this.name = cardRefObj.name
            this.location = '' //stores id of location elem
            this.description = cardRefObj.description
            this.tags = cardRefObj.tags
            this.source = cardRefObj.source

            //Pick card rarity
            let roll = rng(100)
            if(roll > 99){
                this.rarity = 'set'
            }
            else if (roll > 98){
                this.rarity = 'legendary'
            }
            else if (roll > 90){
                this.rarity = 'epic'
            }
            else if (roll > 70){
                this.rarity = 'rare'
            }
            else {
                this.rarity = 'common'
            }
                     
            g.cards.push(this)            
        }

        //Returns card html element
        genHtml(){
            let card = document.createElement('div')
            card.classList = 'card'
            card.id = this.cardId
            card.setAttribute('draggable','true')
            card.setAttribute('ondragstart','drag(event)')

            let cardImg = this.name

            card.innerHTML = `
                    <div class="card-data">
                        <img src="./img/card/rarity/${this.rarity}.svg"/>
                        <h2>${upp(this.name)}</h2>
                    </div>
            `
            card.setAttribute('style',`background-image: url("./img/card/${cardImg}.svg")`)    

            //On right click event
            card.addEventListener("contextmenu", (event) => {
                // event.preventDefault();
                // moveCard(card)
            });

            return card
        }
    }
    
    //Move into Card class somehow
    function moveCard(cardElem){
        // el('hand').appendChild(cardElem)
        el('hand').insertBefore(cardElem, el('hand').firstChild)
    
    }

    //SHOP
    //In plObj
    
    //PLAYER
    class PlayerObj{
        constructor(){
            this.coins = config.gold 
        }

        //Modify coin value
        changeCoins(value){
            this.coins += value
            g.updateUI()
        }

        //Pay for something
        pay(cost, operation, operationValue){
            
            if(operationValue === undefined){           
                operationValue = 1
            }

            if(this.coins >= cost * operationValue){
                this.changeCoins(-Math.abs(cost * operationValue)) 
                if(typeof operation === 'string' && operation === 'inspect'){
                    g.inspectionTable.inspect()
                }
                else if (operation === 'buy'){
                    g.genCard(operationValue, 'hand')
                }
                //Use this for generic cases
                //Wrap pay() in if statement
                else{
                    return true      
                }
            }

            //Can't pay
            else{
                console.log(`Can't pay`);
            }

            g.saveGame()
        }
    }

//INSPECTION TABLE
    class InspectionTable {
        constructor(){
            el('inspectButton').innerHTML = `Inspect a card for ${config.inspectionCost} <img src="./img/ico/coin.svg">`
        }
        
        inspect(){
            if(el('table').childNodes.length > 0){            
                console.log(el('table').childNodes[0]);
                
                //Find card reference by element id
                let cardRef = findByProperty(g.cards, 'location', 'table')
    
                //Override metadata fields
                el('inspector').innerHTML = `
                    <h1 id="name">${upp(cardRef.name)}</h1>          
                        <p id="description">${cardRef.description}</p>
                        <div id="year">Year: ${cardRef.year}</div>
                        <div id="tags">Tags: ${cardRef.tags}</div>
                        <div id="rarity">Rarity: <img src="./img/card/rarity/${cardRef.rarity}.svg"> ${upp(cardRef.rarity)}</div>
                        <div id="source">Source: <a href="${cardRef.source}" target='_blank'>${cardRef.source}</a> </div>
                    `
    
            }    
        }
    }
    //Takes N minutes to complete

//COLLECTION
    class Collection{
        constructor(){
            this.width = 5
            this.height = 2

            //Update id to default page
            this.page = 'page1'         
            el('collection').id = this.page
        }
        
        genSlots(){
            el(this.page).innerHTML = `` 

            let quant = this.width * this.height
            g.genCardSlot(this.page, quant)
            
            //Set collection width
            let gap = 4
            let padding = 24

            el(this.page).setAttribute('style',
                `
                    width: calc(((var(--card-width) + ${gap}px) * ${this.width}) + (2 * ${padding}px));
                    padding:${padding}px;
                ` 
            )

            console.log(`Collection: Slots generated.`);
            
        }

        loadPage(pageId){

            //Update page id of html elem and in game opbject
            el(this.page).id = pageId
            this.page = pageId

            //Regen slots
            this.genSlots()

            //Regen cards
            g.cards.forEach(card => {
                if(card.location.includes(pageId)){
                    el(card.location).append(card.genHtml())
                }      
            })

            console.log(`Collection: ${pageId} page loaded`); 
        }

        //Convert page to pages, generate tabs from pages values.
        //Add option to add new pages
    }
    
//CONTRACT
    //If > 4 cards in album, generate a contract with card description, player has to pick the right card to win.
    class Research{
        constructor(){
            this.researchId = genId('re')
            this.width = rng(4)
            this.height = 1
            this.raritySequence = []

            //Generate rarity puzzle
            for(let i=0;i< this.width * this.height; i++){
                this.raritySequence.push(rarr(cardRarityRef))
            }  
        }

        //Creates html elem
        new(){
            if(g.cards.length <1){
                return
            }

            this.contractCard = rarr(g.cards)

            el('research-paper').innerHTML = ''

            let slotQuantity = this.width * this.height;
            g.genCardSlot('research-paper', slotQuantity)

            //Set descriotion
            el('contract-description').innerHTML = this.contractCard.description

            //Set collection width
            el('research-paper').setAttribute(
                'style',
                `width: calc(
                    (var(--card-width) + 4px) * ${this.width}
                )`
            )

            //Add rarity sequence icons
            this.raritySequence.forEach(node => {
                let img = document.createElement('img')
                img.setAttribute('src', `./img/card/rarity/${node}.svg`)

                el('research-paper').append(img)
            })
        }

        sellResearch(){
            if(g.cards.length <1){
                return
            }

            //Check placed cards 
            let addedCards = findByProperty(g.cards, 'location', 'research', 'includes')
            console.log(addedCards);
            
            //Win if card matches
            if(addedCards != undefined && findByProperty(addedCards, 'name', this.contractCard.name) != undefined){
                console.log('you win');
                g.plObj.changeCoins(config.researchReward)
            //Loose
            } else{
                console.log('you loose');
                g.plObj.changeCoins(-config.researchReward)
 
            }

            g.research = new Research()
            g.research.new()

            //Remove cards from g.cards after completing the research
            addedCards.forEach(card => {
                removeFromArr(g.cards, card)
            })
        }
    }


//START GAME
    let g //global game variable
    let cardsRef //required due to fetch

    function startGame(){

        g = new Game

        //Load/generate game
        g.loadGame()
        g.updateUI()

        //New collection
        g.collection.genSlots();

        //Assign card ref
        g.cardsRef = cardsRef

        //Gen init contract
        g.research = new Research
        g.research.new()
    }

    function forTesting(){
        //Gen test card
        g.genCard(1, `${g.collection.page}-slot0`, 'statics')
        g.genCard(1, `${g.collection.page}-slot1`, 'impulse')
        g.genCard(1, `${g.collection.page}-slot2`, 'mass')
        g.genCard(1, `${g.collection.page}-slot3`, 'acceleration')
        g.genCard(1, `${g.collection.page}-slot4`, 'light')
    }
    
//Fetch csv file, parse to JSON, assing it to reg obj
    fetch('./Library game cards [2024] - Sheet1.csv')
        .then(response => response.text())
        .then(
            csvText  => {
                cardsRef = JSON.parse(csvJSON(csvText))
                return cardsRef
            }
        )
        .then(
            () => startGame()
        )
        .catch(error => console.error('Error:', error));
    