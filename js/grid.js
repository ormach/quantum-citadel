let mapElem = el('map')

let cellSize = 48
let gridWidth = 28
let gridHeight = 28

mapElem.setAttribute('style', `
    display: grid;
    grid-template-columns: repeat(${gridWidth},  ${cellSize}px);
    grid-template-rows:    repeat(${gridHeight}, ${cellSize}px);
`)

let mapWrapper = el('wrapper')
// mapWrapper.setAttribute('style', `
//     width: ${gridWidth * cellSize + 152}px;
//     height: ${gridHeight * cellSize + 152}px;
//     display:flex;
//     justify-content: center;
//     align-items: center;
// `)

//Scrolls to center
let wrapper = el('wrapper')
wrapper.scrollLeft = (wrapper.scrollWidth - window.innerWidth) / 2
wrapper.scrollTop = (wrapper.scrollHeight - window.innerHeight) / 2

// window.onbeforeunload = function () {
//     console.log(wrapper)
//
//     wrapper.scrollTo({
//         // top: document.documentElement.scrollHeight/2 - window.innerHeight/2,
//         // left: document.documentElement.scrollWidth/2 - window.innerWidth/2,
//         left: (wrapper.scrollWidth) / 2
//     });
// }