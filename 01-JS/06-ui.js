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

        //Create a button for each building in ref object
        for(let key in buildingsRef){
            if(buildingsRef[key].export !== 'y') continue;

            //Button HTML
            let btnContent = `
                <h2>${upp(key)}</h2>
                <p>${buildingsRef[key].cost} coins / ${buildingsRef[key].time} min</p>
                <div class="building-img-container building" style="width:${buildingsRef[key].width}px; height:${buildingsRef[key].height}px;">
                    <img src="./03-IMG/structure/id=${key}, variant=1.png">
                </div>
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

        //Navigation
        el('coin-indicator').innerHTML = `${g.plObj.coins}`
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