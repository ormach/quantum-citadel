let mapElem = el('map')

let cellSize = 24
let gridWidth = 96
let gridHeight = 14

mapElem.setAttribute('style', `
    grid-template-columns: repeat(${gridWidth},  ${cellSize}px);
    grid-template-rows:    repeat(${gridHeight}, ${cellSize}px);
`)

//Scrolls to center
let wrapper = el('wrapper')
wrapper.scrollLeft = (wrapper.scrollWidth - window.innerWidth) / 2
wrapper.scrollTop = (wrapper.scrollHeight - window.innerHeight) / 2

//Game map
class GameMap{
    constructor(){
        this.buildings = []
        this.buildMode = false
        this.focusedBuilding = null
    }

    build(buildingType){
        this.buildMode = true

        //Gen new building object
        let newBuildingObj = new Building(buildingType)
        this.buildings.push(newBuildingObj)

        //Generate html element
        let building = document.createElement('div')
        building.setAttribute('class', `building`)
        building.setAttribute('type', buildingType)
        building.setAttribute('id', this.buildings[this.buildings.length - 1].id)
        building.innerHTML = `<img src="./img/structure/${buildingType}.png">`
        el('map').appendChild(building)

        //Add mouse move event listener
        mapElem.addEventListener('mousemove', moveBuilding);

        //Add click exit event
        mapElem.addEventListener('click', placeBuilding);
    }
}

function moveBuilding(){
    let x = relativeCoords(event).x + 1
    let y = relativeCoords(event).y + 1

    if(y > 0 && y < gridHeight && x > 0 && x < gridWidth){
        el(g.gameMap.focusedBuilding).setAttribute('style', `
            grid-column-start: ${x};
            grid-column-end: ${x};    
        
            grid-row-start: ${y};
            grid-row-end: ${y};
            
            width:${buildingsRef[el(g.gameMap.focusedBuilding).getAttribute('type')].width}px; 
            height:${buildingsRef[el(g.gameMap.focusedBuilding).getAttribute('type')].height}px;
        `)
    }

    console.log(x, y)
}
function placeBuilding(){
    g.gameMap.buildMode = false
    console.log(el(g.gameMap.focusedBuilding).getAttribute('style'))
    mapElem.removeEventListener('mousemove', moveBuilding);
    mapElem.removeEventListener('mousemove', placeBuilding);
}




//Relative coords for map
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

class Building{
    constructor(type){
        this.id = genId('building')
        this.buildingType = buildingsRef[type].type
        this.cost = buildingsRef[type].cost
        this.time = buildingsRef[type].time
        this.size = buildingsRef[type].size

        //Store id for allocation
        g.gameMap.focusedBuilding = this.id
    }
}