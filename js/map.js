//MAP css grid
let mapElem = el('map')
let cellSize = 24
let gridWidth = 96
let gridHeight = 14

//Set map columns and rows based on vars above
mapElem.setAttribute('style', `
    grid-template-columns: repeat(${gridWidth},  ${cellSize}px);
    grid-template-rows:    repeat(${gridHeight}, ${cellSize}px);
`)

//Scrolls to center
let wrapper = el('wrapper')
wrapper.scrollLeft = (wrapper.scrollWidth - window.innerWidth) / 2
wrapper.scrollTop = (wrapper.scrollHeight - window.innerHeight) / 2

//Game map class
class GameMap{
    constructor(){
        this.buildings = []
        this.buildMode = false
        this.focusedBuilding = null
    }

    build(buildingType, buildingRefObj){
        let newBuildingObj

        //Gen new building object

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
}


//BUILDINGS
//Class for building obj-HTMLelement
class Building{
    constructor(type, buildingRefObj){
        this.id = genId('building')
        this.buildingType = type
        this.cost = buildingsRef[type].cost
        this.time = buildingsRef[type].time
        this.modal = buildingsRef[type].modalId

        this.width = buildingsRef[type].width
        this.height = buildingsRef[type].height

        if(buildingRefObj){
            this.x = buildingRefObj.x
            this.y = buildingRefObj.y
        }

        //Store id for allocation
        g.gameMap.focusedBuilding = this.id

        // console.log(this)

        //Hide builder modal
        el('builders').classList.add('hide')
    }
}

//Generate HTML elem for building
function genBuildingHtmlElem(buildingObject, mode){

    // console.log('Generating building html elem.')

    let building = document.createElement('div')

    building.setAttribute('class', `building`)
    building.setAttribute('type', buildingObject.buildingType)
    building.setAttribute('id', buildingObject.id)
    building.innerHTML = `<img src="./img/structure/id=${buildingObject.buildingType}.png">`

    el('map').appendChild(building)

    //Add coordinates if building was loaded and has xy
    if(mode === 'load'){
        building.setAttribute('style', `
            grid-column-start: ${buildingObject.x};
            grid-column-end: ${buildingObject.x};    
        
            grid-row-start: ${buildingObject.y};
            grid-row-end: ${buildingObject.y};
            
            width:${buildingObject.width}px; 
            height:${buildingObject.height}px;
        `)

        // console.log('Loading:', buildingObject, buildingObject.x, buildingObject.y)

        //Add onclick event if modal is defined
        if(buildingObject.modal){
            building.setAttribute('onclick', `toggleModal('${buildingObject.modal}')`)
            building.classList.add('interactive')
        }
    }

    //Trigger build mode
    else{
        g.gameMap.buildMode = true
        g.gameMap.focusedBuildingHtmlElem = building

        //Add mouse move event listener
        mapElem.addEventListener('mousemove', moveBuilding);

        //Add click exit event
        mapElem.addEventListener('click', placeBuilding);
    }
}

//Building functions
//Handles hover building projection while placing
function moveBuilding(){
    //Set coordinates
    let x = relativeCoords(event).x + 1
    let y = relativeCoords(event).y + 1

    g.gameMap.focusedBuildingObj = findByProperty(g.gameMap.buildings, 'id', g.gameMap.focusedBuilding)
    // console.log(focusedBuildingObj)

    if(y > 0 && y < gridHeight && x > 0 && x < gridWidth){
        el(g.gameMap.focusedBuilding).setAttribute('style', `
            grid-column-start: ${x};
            grid-column-end: ${x};    
        
            grid-row-start: ${y};
            grid-row-end: ${y};
            
            width:${buildingsRef[el(g.gameMap.focusedBuilding).getAttribute('type')].width}px; 
            height:${buildingsRef[el(g.gameMap.focusedBuilding).getAttribute('type')].height}px;
        `)

        //Update object coords
        g.gameMap.focusedBuildingObj.x = x
        g.gameMap.focusedBuildingObj.y = y
    }

    // console.log(x, y)
}
//Clears event listeners when projection is placed on map
function placeBuilding(){

    //Exit build mode, building movement is done via moveBuilding event listener
    g.gameMap.buildMode = false

    //Clear event listeners for movement and placement
    mapElem.removeEventListener('mousemove', moveBuilding);
    mapElem.removeEventListener('click', placeBuilding);

    let focusedBuildingObj = findByProperty(g.gameMap.buildings, 'id', g.gameMap.focusedBuilding)
    // console.log(focusedBuildingObj.x, focusedBuildingObj.y)

    //Add on click after placing the building to avoid triggering the modal on placing
    // console.log('focusedBuilding:', g.gameMap.focusedBuildingObj)
    g.gameMap.focusedBuildingHtmlElem.setAttribute('onclick', `toggleModal('${g.gameMap.focusedBuilding.modal}')`)
    if(g.gameMap.focusedBuildingObj.modal) {
        g.gameMap.focusedBuildingHtmlElem.setAttribute('onclick', `toggleModal('${g.gameMap.focusedBuildingObj.modal}')`)
        g.gameMap.focusedBuildingHtmlElem.classList.add('interactive')
    }

    // console.log(el(g.gameMap.focusedBuilding).getAttribute('style'))
    g.saveGame()
}

//Relative coords for map, helps to keep buildings aligned with css grid tiles
function relativeCoords ( event , mode ) {
    var bounds = mapElem.getBoundingClientRect();
    var x = event.clientX - bounds.left;
    var y = event.clientY - bounds.top;

    if (mode == 'coords') {
        return {x: x, y: y};
    }else{
        return {x: Math.floor(x / cellSize), y: Math.floor(y / cellSize)};
    }
}