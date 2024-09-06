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

    function updateUI(){
        el('coin-indicator').innerHTML = `${g.plObj.coins}`
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

        //Creates card elements
        genCard(number, locationId, name){
            for(let i = 0; i < number; i++){
                let card

                if(name != undefined){
                    card = new Card(name)                    
                } else {
                    card = new Card(rarr(cardsRef).id)
                }

                let cardElem = card.genHtml()
                // el('hand').append(cardElem)
                card.location = locationId

                if(locationId === 'hand'){
                    el(locationId).insertBefore(cardElem, el(locationId).firstChild)
                }
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
        constructor(cardName){
                        
            let cardRefObj = findByProperty(cardsRef, 'id', cardName)            

            this.cardId = genId('cr')
            this.name = cardName
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
            // cardImg = 'placeholder'

            // <div class ="card-frame">
            // <div/>
            card.innerHTML = `
                    <div class="card-data">
                        <img src="./img/card/rarity/${this.rarity}.svg"/>
                        <h2>${upp(this.name)}</h2>
                    </div>
            `
            card.setAttribute('style',`background-image: url("./img/card/${cardImg}.svg")`)
            

            // <p>Description</p>        

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
    function buy(quant){
        if(g.plObj.pay(config.cardPrice * quant)
        ){
            g.genCard(quant, 'hand')
        }
    }
    
    //PLAYER
    class PlayerObj{
        constructor(){
            this.coins = config.gold 
        }

        //Modify coin value
        changeCoins(value){
            this.coins += value
            updateUI()
        }

        //Pay for something
        pay(value, operation, operationValue){
            if(this.coins >= value){
                this.changeCoins(-Math.abs(value)) 
                if(typeof operation === 'string' && operation === 'inspect'){
                    g.inspectionTable.inspect()
                }
                else if (operation === 'buy'){
                    buy(operationValue)
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
            el(this.page).id = pageId
            this.page = pageId
            this.genSlots()

            g.cards.forEach(card => {
                console.log(card.location.includes(pageId));
                //If card location contains page id
                //Add card to page
            })
            console.log(`Collection: ${pageId} page loaded`);
            
        }

        //Change page
        //Clears all slots
        //Adds cards from another page to slots
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

            //Generate description quest
            //Pick a card from album
            //Get all cards from album                
            this.contractCard = rarr(g.cards)
            console.log(this.contractCard);
            
        }

        //Creates html elem
        new(){
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
            //Check placed cards 
            let addedCards = findByProperty(g.cards, 'location', 'research', 'includes')
            console.log(addedCards);
            
            //Win if card matches
            if(addedCards != undefined && findByProperty(addedCards, 'name', this.contractCard.name) != undefined){
                console.log('you win');
                
                g.plObj.changeCoins(500)
            //Loose
            } else{
                console.log('you loose');
                g.plObj.changeCoins(-500)
 
            }

            g.plObj.research = new Research()
            g.plObj.research.new()
        }
    }


//START GAME
    let g //global game variable
    let cardsRef
    function startGame(){

        g = new Game
        updateUI()

        //new collection
        g.collection.genSlots();

        //assign card reft
        g.cardsRef = cardsRef
        
        //Gen test card
        g.genCard(1, `${g.collection.page}-slot0`, 'statics')
        g.genCard(1, `${g.collection.page}-slot1`, 'impulse')
        g.genCard(1, `${g.collection.page}-slot2`, 'mass')
        g.genCard(1, `${g.collection.page}-slot3`, 'acceleration')
        g.genCard(1, `${g.collection.page}-slot4`, 'light')

        //gen init contract
        g.plObj.research = new Research
        g.plObj.research.new()

        // el('table').append(card.genHtml())
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
    