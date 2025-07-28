//MAP CLASS
class GameMap{
    constructor(){
        this.buildings = []
        this.buildMode = false
        this.focusedBuilding = null

        //MAP css
        this.mapElem = el('map')
        this.cellSize = 24
        this.gridWidth = 80


        //Set map width
        this.mapElem.setAttribute('style', `
            width: ${this.gridWidth * this.cellSize}px;
        `)

        //Set background layer width based on map width
        el('map-environment').setAttribute('style', `
            width: ${this.gridWidth * this.cellSize}px;
        `)

        this.scrollToMapCenter()
    }


    //Buildings
    build(buildingType, buildingRefObj){
        let newBuildingObj

        //Prebuild
        if(buildingRefObj){
            newBuildingObj = new Building(buildingType, buildingRefObj)
            genBuildingHtmlElem(newBuildingObj, 'load')
        }

        //New building
        else{
            newBuildingObj = new Building(buildingType)
            genBuildingHtmlElem(newBuildingObj)
        }

        this.buildings.push(newBuildingObj)
    }


    //Utility
    scrollToMapCenter(){
        let wrapper = el('map-scroll-box')
        wrapper.scrollLeft = (wrapper.scrollWidth - window.innerWidth) / 2
        wrapper.scrollTop = (wrapper.scrollHeight - window.innerHeight) / 2
    }


    //Set environment decorations
    setMapDecoration(){

        //Assign reference env object
        let rootRefObj

        //LOAD decorations
        if(g.gameMap.envDecorations != undefined &&  Object.keys(g.gameMap.envDecorations).length !== 0) {
            rootRefObj = g.gameMap.envDecorations
            console.log('Saved env ref:', rootRefObj)

            for(let key in rootRefObj) {

                //Create containers.
                let envContainer = document.createElement('div');
                envContainer.id = `${key}-container`;
                //Class
                envContainer.classList.add('envContainer')


                //Add sprites to container
                if (key === 'sky') {
                    //Add sun
                    let sun = document.createElement('img');
                    sun.setAttribute('src', './img/bg/sun-1.svg');
                    sun.classList.add('sun')
                    envContainer.append(sun)
                }


                //Shuffle position coordinates once
                if (rootRefObj[key].absoluteCoords != undefined) {
                    shuffle(rootRefObj[key].absoluteCoords)
                }

                //Generate sprites
                for (let i = 0; i < Object.keys(rootRefObj[key].sprites).length; i++) {

                    let sprite = rootRefObj[key].sprites[Object.keys(rootRefObj[key].sprites)[i]]

                    // console.log('loading sprite')
                    // console.log(sprite)

                    //Append sprite
                    envContainer.append(this.genEnvElemHtml(sprite))
                }

                //Append container
                el('map-environment').appendChild(envContainer);
            }
        }

        //NEW decorations
        else {
            this.envDecorations = {}
            rootRefObj = envDecorationsRef
            console.log('New env ref:', rootRefObj)

            for(let key in rootRefObj) {
                //Add sprites object to stored ref object once per key
                this.envDecorations[key] = {sprites: {}}

                //CONTAINER: Create
                let envContainer = document.createElement('div');
                envContainer.id = `${key}-container`;
                envContainer.classList.add('envContainer')

                //SPRITE: Add sun
                if (key === 'sky') {
                    //Add sun
                    let sun = document.createElement('img');
                    sun.setAttribute('src', './img/bg/sun-1.svg');
                    sun.classList.add('sun')
                    envContainer.append(sun)
                }

                //SPRITE: Shuffle position coordinates once
                if (rootRefObj[key].absoluteCoords != undefined) {
                    shuffle(rootRefObj[key].absoluteCoords)
                }

                //SPRITE: Generate
                for (let i = 0; i < rng(envDecorationsRef[key].elementQuantity[0], envDecorationsRef[key].elementQuantity[1]); i++) {

                    //Append sprite
                    envContainer.append(
                        this.genEnvElemHtml(
                            this.genEnvElemObj(key, i)
                        )
                    )
                }

                //CONTAINER: Append
                el('map-environment').appendChild(envContainer);
            }

            console.log('Stored env decorations:', g.gameMap.envDecorations)
        }
    }

    genEnvElemObj(key, i){

        //Store ref object in game map
        let envElemRef = clone(rObj(envDecorationsRef[key].sprites))

        //Gen unique id
        envElemRef.elemId = genId(`${envElemRef.id}-`)


        //Style
        let style = ``

        //Absolute placement
        if (envDecorationsRef[key].absoluteCoords != undefined) {
            style += `
                        left: ${envDecorationsRef[key].absoluteCoords[i].x}; 
                        top:  ${envDecorationsRef[key].absoluteCoords[i].y}; 
                    `
        }

        //Spacing
        if (envElemRef.spacing != undefined) {
            style += `margin-left: ${24 * rng(envElemRef.spacing[0], envElemRef.spacing[1])}px;`
        }
        if (envElemRef.spacingY != undefined) {
            style += `padding-bottom: ${24 * rng(envElemRef.spacingY[0], envElemRef.spacingY[1])}px;`
        }

        //Flip elem
        if (envElemRef.flipXPercentChance != undefined) {
            if (rng(100) < envElemRef.flipXPercentChance) {
                style += `transform:scaleX(-1);`
            }
        }

        //Set animation
        if (envElemRef.animationDuration != undefined) {
            style += `animation-duration: ${rng(envElemRef.animationDuration[0], envElemRef.animationDuration[1])}ms;`
        }

        //Save ref obj in game map
        envElemRef.style = style
        envElemRef.spriteType = rng(envElemRef.quantity)
        this.envDecorations[key].sprites[envElemRef.elemId] = envElemRef
        // console.log(this.envDecorations[key])

        return envElemRef
    }

    genEnvElemHtml(envElemRef){
        // console.log(envElemRef)

        //Create HTML sprite
        let envElemHTML

        //Create animation container
        if (envElemRef.animation) {
            envElemHTML = document.createElement('div');
        }

        //Create img html element
        else {
            envElemHTML = document.createElement('img');
            //Img source
            envElemHTML.setAttribute('src', `./img/bg/id=${envElemRef.id}, variant=${envElemRef.spriteType}.svg`);
        }

        //Class
        envElemHTML.classList.add(envElemRef.id)
        //Animation
        if (envElemRef.speed != undefined) {
            envElemHTML.classList.add(`speed-${rng(envElemRef.speed, 1)}`)
        }

        //Style
        envElemHTML.setAttribute('style', envElemRef.style)

        return envElemHTML
    }
}


//BUILDINGS CLASS
class Building{
    constructor(type, buildingRefObj){
        this.id = genId('building')
        this.buildingType = type
        this.cost = buildingsRef[type].cost
        this.time = buildingsRef[type].time
        this.event = buildingsRef[type].event

        this.width = buildingsRef[type].width
        this.height = buildingsRef[type].height

        this.onclick = genOnClick(buildingsRef[type].event)

        if(buildingRefObj){
            this.x = buildingRefObj.x
            this.y = buildingRefObj.y
        }

        //Store id for allocation
        g.gameMap.focusedBuilding = this.id

        //Hide builder modal
        el('builders').classList.add('hide')
    }
}

//Not methods because on load building class is not initiated
//Generate HTML elem for building
function genBuildingHtmlElem(buildingObject, mode){

    let building = document.createElement('div')

    building.setAttribute('class', `building projection`)
    building.setAttribute('type', buildingObject.buildingType)
    building.setAttribute('id', buildingObject.id)

    //Building image
    building.innerHTML = `
        <div class="sprite-container" style="height: ${buildingObject.height +2}px; width:${buildingObject.width +2}px;">
            <img class="sprite" src="./img/structure/id=${buildingObject.buildingType}, variant=1.png" style="height: ${buildingObject.height +2}px;">
        </div>
    `

    el('map').appendChild(building)

    //Add coordinates if building was loaded and has xy
    if(mode === 'load'){
        building.setAttribute('style', `
            left: ${(buildingObject.x - 2) * g.gameMap.cellSize}px;
            bottom: 50%;    
            
            width:${buildingObject.width}px; 
            height:${buildingObject.height}px;
        `)

        // console.log('Loading:', buildingObject, buildingObject.x, buildingObject.y)

        //Add onclick event if modal is defined
        if(buildingObject.onclick != undefined){
            building.setAttribute('onclick', buildingObject.onclick)
            building.classList.add('interactive')
        }

        //Remove projection if you are loading a building
        building.classList.remove('projection')
    }

    //Trigger build mode
    else{
        g.gameMap.buildMode = true
        g.gameMap.focusedBuildingHtmlElem = building

        //Add mouse move event listener
        g.gameMap.mapElem.addEventListener('mousemove', moveBuilding);

        //Add click exit event
        g.gameMap.mapElem.addEventListener('click', placeBuilding);
        // el('body').addEventListener('click', placeBuilding);
    }
}

function genOnClick(event){
    let onclick

    if(event){
        if(event.includes('modal')){
           onclick = `toggleModal('${event.split('-')[1]}')`
        }
        else if(event.includes('click')){
            onclick = `clickEvent("${event.split('-')[1]}")`
        }
    }

    return onclick
}

//Handles hover building projection while placing
function moveBuilding(){
    //Set coordinates
    let x = relativeCoords(event).x + 1
    let y = relativeCoords(event).y + 1

    g.gameMap.focusedBuildingObj = findByProperty(g.gameMap.buildings, 'id', g.gameMap.focusedBuilding)
    // console.log(focusedBuildingObj)

    //Prevent placing building beyond the map border
    if(x < 0){x = 0}
    if(x > g.gameMap.gridWidth){x = g.gameMap.gridWidth}

    //Update CSS
    el(g.gameMap.focusedBuilding).setAttribute('style', `
        left: ${(x - 2) * g.gameMap.cellSize}px;
        bottom: 50%;
        
        width:${buildingsRef[el(g.gameMap.focusedBuilding).getAttribute('type')].width}px; 
        height:${buildingsRef[el(g.gameMap.focusedBuilding).getAttribute('type')].height}px;
    `)

    //Update object coords
    g.gameMap.focusedBuildingObj.x = x
    g.gameMap.focusedBuildingObj.y = 8

    // console.log(x, y)
}

//Clears event listeners when projection is placed on map
function placeBuilding(){

    //Exit build mode, building movement is done via moveBuilding event listener
    g.gameMap.buildMode = false

    //Clear event listeners for movement and placement
    g.gameMap.mapElem.removeEventListener('mousemove', moveBuilding);
    g.gameMap.mapElem.removeEventListener('click', placeBuilding);
    // el('body').removeEventListener('click', placeBuilding);

    let focusedBuildingObj = findByProperty(g.gameMap.buildings, 'id', g.gameMap.focusedBuilding)
    // console.log(focusedBuildingObj.x, focusedBuildingObj.y)

    //Add on click after placing the building to avoid triggering the modal on placing
    if(focusedBuildingObj.onclick != undefined){
        g.gameMap.focusedBuildingHtmlElem.setAttribute('onclick', focusedBuildingObj.onclick)
        g.gameMap.focusedBuildingHtmlElem.classList.add('interactive')
    }

    g.gameMap.focusedBuildingHtmlElem.classList.remove('projection')

    // console.log(focusedBuildingObj)
    g.saveGame()
}

//Relative coords for map, helps to keep buildings aligned with css grid tiles
function relativeCoords(event , mode) {
    var bounds = g.gameMap.mapElem.getBoundingClientRect();
    var x = event.clientX - bounds.left;
    var y = event.clientY - bounds.top;

    if (mode == 'coords') {
        return {x: x, y: y};
    }else{
        return {x: Math.floor(x / g.gameMap.cellSize), y: Math.floor(y / g.gameMap.cellSize)};
    }
}

//Get stone
function clickEvent(mode){
    if(mode === 'stone'){
        showAlert('+3 coins')
        g.plObj.changeCoins(3)
    }
}