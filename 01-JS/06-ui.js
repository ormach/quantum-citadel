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
        //If target elem is card, change target to cards container
        if(ev.target.classList.contains('card')){
            overlappingCard = ev.target
            targetContainer = ev.target.parentNode
            // ev.target.parentNode.insertBefore(document.getElementById(data), ev.target);
        }
        // Duplicates per container in card
        else if (ev.target.parentNode.parentNode.classList.contains('card')){
            overlappingCard = ev.target.parentNode.parentNode
            targetContainer = ev.target.parentNode.parentNode.parentNode
        }
        // If elem in card
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

        //Calculate reward
        // console.log(targetContainer);
        g.calculateReward()
        
        // console.log(
        //     findByProperty(g.cards, 'cardId', draggedCard.id)
        // );   
    }


//Modals
    function toggleModal(modalId){
        let modals = document.getElementById('modal-wrapper').querySelectorAll('.modal')

        // modals.forEach(modal => {
        //     if(modal.id !== modalId) modal.classList.toggle('hide')
        // })

        el(modalId).classList.toggle('hide')
    }

    
//Generate builders modal UI
    function generateUI(){
        console.log('Generating UI.');

        //Clear shop
        el('structure-container').innerHTML = ""

        //BUILDINGS: buttons
        //Calculate total number of mines for dynamic cost
        let minesQuant = 1
        for( let building in g.gameMap.buildings ) {
            if(g.gameMap.buildings[building].buildingType === 'mine'){
                minesQuant++
            }
        }

        //Add button per building

        //If building type is not included in tree nodes > continue
        let unlockedBuildings = []
        g.plObj.treeNodes.forEach(node => {
            if(node.buildingType !== undefined){
                unlockedBuildings.push(node.buildingType)
            }
        })


        //Mark buildings to exclude from shop
        treeRef.forEach(node => {
            if(
                node.buildingType !== undefined
            &&  unlockedBuildings.includes(node.buildingType) === false
            ){
                buildingsRef[node.buildingType].passiveLock = true
            }
            else if(node.buildingType !== undefined){
                buildingsRef[node.buildingType].passiveLock = false
            }
        })

        for(let key in buildingsRef){
            if(buildingsRef[key].export !== 'y') continue;
            if(buildingsRef[key].passiveLock === true) continue;

            //Gen building sprite
            let img = genBuildingSprite(buildingsRef[key])

            //Resolve MINE cost
            if(key === 'mine'){
                buildingsRef['mine'].costWood = config.mineCostScaleBase * (minesQuant)
            }

            //Cost
            let cost = ""
            resourcesRef.forEach(res => {
                let resValue = buildingsRef[key][`cost${upp(res)}`]

                if(
                    resValue !== undefined
                 && resValue * 1 > 0
                ){
                    cost += `
                        <div class="flex center">
                            <img src="../03-IMG/ico/id=${res}, variant=1.svg"></img>
                            <p>${resValue}</p>
                        </div>`
                }
            })

            //Button HTML
            let btnContent = `
                <div class="data-container">
                    <h3>${upp(key)}</h3>
                    <p class="description">${buildingsRef[key].description}</p>
                    <div class="building-cost-container">${cost}</div>
                </div>

                ${img}
            `

            //Create HTML element
            let buildingBtn = document.createElement('button')
            buildingBtn.classList = 'btn-structure'
            buildingBtn.innerHTML = btnContent
            buildingBtn.setAttribute('onclick', `g.plObj.pay('build', '${key}')`)

            //Append
            el('structure-container').append(buildingBtn)
        }
    }


//Regen html based on game state
    function updateUI(){
        let coinIco = `<img src="../03-IMG/ico/coin.svg">`

        //Resources
        el('wood-indicator').innerHTML = `${g.plObj.resources.wood}`
        el('stone-indicator').innerHTML = `${g.plObj.resources.stone}`
        el('coin-indicator').innerHTML = `${g.plObj.resources.coins}`

        //Navigation
        el('lvl').innerHTML = `LVL: ${g.plObj.lvl}`
        el('exp').innerHTML = `EXP: ${g.plObj.exp}/${g.plObj.lvlUpExp}`

        //Inspection
        el('inspectButton').innerHTML = `Inspect a card for ${config.inspectionCost + coinIco}`

        //Research
        el('contract-button-skip').innerHTML = `Skip (${config.researchSkip + coinIco})`

        //Allocate cards
        // g.cards.forEach(card => {
        //     // console.log(cardElem);       
        // })
    }

    
//Toggle hamburger
    function toggleMenu(){
        el('menu').classList.toggle('hide')
    }