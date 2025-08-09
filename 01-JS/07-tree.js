let prefix = 'treenode_'


//Spend tree points
//Adds tree node obj to playerObj
    function addTreeNode(nodeId, treeHtmlElemId){
        //Allocate new node
        if(g.plObj.treePoints > 0){
            let node = findByProperty(treeRef, 'id', nodeId)

            // Add skill node to player obj    
            g.plObj.treeNodes.push(node)    
            
            g.plObj.treePoints--

            allocateTreeNode(treeHtmlElemId)

            g.saveGame()

            // resolvePlayerStats()
            // lvlupUiIndication()
            // syncUi()
            generateUI()
        }

        //Not enough points
        else{
            showAlert(`All passive skill points are allocated.`)
        }
    }


//Changes state of a tree node in UI
    function allocateTreeNode(nodeElemId){
        //Set node to allocated
        g.treeObj[nodeElemId].allocated = true

        //Add class to highlight allocated node and paths
        el(nodeElemId).classList.add('node-allocated')

        //Highlight connectors for each direction
        g.treeObj[nodeElemId].tileConnectors.forEach(connector => {
            highlightPath(nodeElemId, connector)
        })

        //Highlight adjacent nodes
    }

    //Add class to highlight the path
    function highlightPath(elemId, direction){

        let treeElem = el(findAdjacentTile(elemId, direction))
        let n = 1

        //Repeats untill all paths are highlighted
        while(n < 5 && treeElem.classList.contains('path')){
            n++
            treeElem.classList.add('active-path')
            treeElem = el(findAdjacentTile(treeElem.id, direction))
        }
    }

    //Returns id of an adjacent cell based on direction
    function findAdjacentTile(tileId, direction){
        let column = tileId.split('_')[1].split('-')[0] * 1
        let row    = tileId.split('_')[1].split('-')[1] * 1

        if      (direction == 'T'){
            return `${prefix}${column    }-${row - 1}`
        }else if(direction == 'R'){
            return `${prefix}${column + 1}-${row    }`
        }else if(direction == 'D'){
            return `${prefix}${column    }-${row + 1}`
        }else if(direction == 'L'){
            return `${prefix}${column - 1}-${row    }`
        }else if(direction == 'RD'){
            return `${prefix}${column + 1}-${row + 1}`
        }else if(direction == 'LD'){
            return `${prefix}${column - 1}-${row + 1}`
        }else if(direction == 'RT'){
            return `${prefix}${column + 1}-${row - 1}`
        }else if(direction == 'LT'){
            return `${prefix}${column - 1}-${row - 1}`
        }
    }


//Tree UI
    function generateSkillTree(){
        
        el('skill-tree').innerHTML = ``

        let column        = 0
        let row           = 0
        let nodeType
        let node

        
        //Build saved tree from g.treeObj
            if(Object.keys(g.treeObj).length > 0){
                Object.keys(g.treeObj).forEach(node => {
                    // console.log(g.treeObj[node]);
                    let treeNode = g.treeObj[node]
                    createTreeCell(treeNode.tileColumn, treeNode.tileRow, treeNode.tileType)
                })
            }
        //Build new from treeStructure
            else{
                treeStructure.forEach(tile => {
    
                    nodeType = undefined
    
                    //Split data string
                    let tileContent = tile.split('_') // 11-4_lif_T-R-D-L

                    //Create tile object 
                    g.treeObj[prefix + tileContent[0]] = {}
                    
                    //Set tile object properties
                    node                = g.treeObj[prefix + tileContent[0]] // this causes g.treeObj obj to be updated
                    node.tileColumn     = parseInt(tileContent[0].split('-')[0])
                    node.tileRow        = parseInt(tileContent[0].split('-')[1])
                    node.tileType       = tileContent[1]            //'T12'
                    node.tileConnectors = tileContent[2].split('-') //creates array of tile connector markers T,BB etc.
                    node.imgPath        = tileContent[1]            //sets tile image
    
                    createTreeCell(node.tileColumn, node.tileRow, nodeType)
                })
            }

        //Build base tree
            for( let i = 0; i < config.treeRows * config.treeColumns; i++){

                //Cell creation trigger
                let createCell = false

                //Set row Y id
                column++
                if(column > config.treeColumns){column = 1}

                //Set column X id
                if(i % config.treeColumns == 0){row ++}

                //Set tile images
                //Rows 
                let refRows = [1, 9] //add 13 to add row connectors

                if(
                       refRows.includes(row)
                    // || [3].includes(column) && [2].includes(row)
                ){
                    createCell = true
                    nodeType = 'horizontal-path'
                }

                //COLUMNS 
                let refColumns = [1,3,5,9,13,17,21]
                if(
                        refColumns.includes(column) 
                    // || [2,4].includes(column) && [3].includes(row) 
                    // || [18,20].includes(column) && [2].includes(row)
                ){
                    createCell = true
                    nodeType = 'vertical-path'
                }

                //Clears
                if(
                       [6,7,8, 14,15,16, 22,23,24,  27].includes(column) && row == 1 //1st row
                    || column == 3 && row == 8                                 //Cita break
                    // || [17,21].includes(column) && [1,2,3].includes(row)             //Wanderer
                    // || [24].includes(column) && [5].includes(row)
                ){
                    createCell = false
                }

                //Abort if cell exists
                if(el(`${prefix}${column}-${row}`) != undefined){
                    createCell = false
                }

                //Set cell content
                if(createCell){
                    createTreeCell(column, row, nodeType)
                }
            }

        //Preallocate initial class node
            g.treeObj[`${prefix}3-1`] = {
                tileColumn: 3,
                tileRow: 1,
                tileType: 'sta',
                tileConnectors: ['D', 'R', 'L'],
                allocated: true,
                imgPath:'sta'
            }
            createTreeCell(3, 1)

        //Creates tree tile elem
            function createTreeCell(column, row, node){
                //Override node if paths were added in treeStructure
                if(node == 'ver'){ 
                    node = 'vertical-path'
                }

                //Gen path tile
                if(node == 'vertical-path' || node == 'horizontal-path'){

                    if(node == 'horizontal-path'){
                        el('skill-tree').innerHTML += `
                            <div id="${prefix}${column}-${row}" class='tree-tile path'>
                                <div class="tree-path" style="transform: rotate(90deg)"></div>
                            </div>
                        `
                    }
                    else {
                        el('skill-tree').innerHTML += `
                            <div id="${prefix}${column}-${row}" class='tree-tile path'>
                                <div class="tree-path"></div>
                            </div>
                        `
                    }

                    el(`${prefix}${column}-${row}`).setAttribute('style',`grid-column-start:${column}; grid-row-start:${row}`)

                } 
                
                //Gen empty tile
                else if(node == 'empty'){
                    el('skill-tree').innerHTML += `
                        <div id="${prefix}${column}-${row}" class='tree-tile'></div>
                    `
                    el(`${prefix}${column}-${row}`).setAttribute('style',`grid-column-start:${column}; grid-row-start:${row}`)

                } 
                
                //Gen node
                else {
                    //Find matching obj in g.treeObj
                    // console.log(`${prefix}${column}-${row}`);
                    let treeObjNode = g.treeObj[`${prefix}${column}-${row}`]

                    //Set cell content
                        //Add directional connectors  
                    let directionLineElems = ''             
                    treeObjNode.tileConnectors.forEach(direction => {
                        directionLineElems  += `<div class='${direction}'></div>`
                    })
                    

                    let cellContent = `
                        <img class="btn--ico btn-frame" src="./03-img/tree/${treeObjNode.imgPath}.svg"> 
                        ${directionLineElems}
                    `
        
                    //Creates new tile
                    if(el(`${prefix}${column}-${row}`) == undefined){
                        
                        //Set elem type
                        let elemType = 'button'
                        if(node == 'div'){elemType = 'div'}
                    
                        //Set content
                        el('skill-tree').innerHTML += `
                            <${elemType} id="${prefix}${column}-${row}" class='tree-tile'>
                                ${cellContent}
                            </${elemType}>
                        `
        
                        //Set elem to a particular grid tile
                        el(`${prefix}${column}-${row}`).setAttribute('style',`grid-column-start:${column}; grid-row-start:${row}`)

                        //Add onclick event
                        el(`${prefix}${column}-${row}`).setAttribute('onclick', `nodePreview(this)`)
                    }
                    //Updates existing tile
                    else{
                        el(`${prefix + column}-${row}`).innerHTML = cellContent
                    }

                    //Add class for small travel nodes
                    // console.log(treeObjNode.imgPath)
                    if(['pow','def','tra','lif','inv','slo','dic','cha','sta'].indexOf(treeObjNode.imgPath) > -1){
                        el(`${prefix}${column}-${row}`).classList.add('compact-node')
                    }
                }
            }

        //Highlight allocated nodes
            for(let node in g.treeObj){
                if(g.treeObj[node].allocated){
                    allocateTreeNode(node)
                }
            }
    }



//Trigger node pop-up
    function nodePreview(nodeElem){

        //Find related node
            let node = findByProperty(treeRef, 'id', g.treeObj[nodeElem.id].tileType)
            let objNode = g.treeObj[nodeElem.id]

        //See if adjacent nodes are allocated
            let adjacentNodeIsAllocated = false
            let nodeConnectors = g.treeObj[nodeElem.id].tileConnectors
            let adjacentNode, newColumnVal, newRowVal

            nodeConnectors.forEach(connector => {
                //Find next node
                if(        connector == 'T'){

                    newColumnVal = objNode.tileColumn
                    newRowVal    = objNode.tileRow - 1

                    adjacentNode = g.treeObj[`${prefix}${newColumnVal}-${newRowVal}`]

                    while(adjacentNode == undefined){
                        newRowVal--
                        adjacentNode = g.treeObj[`${prefix}${newColumnVal}-${newRowVal}`] 
                    }

                    if(adjacentNode.allocated){
                        adjacentNodeIsAllocated = true
                    }

                    // console.log(el(`${prefix}${newColumnVal}-${newRowVal}`));

                } else if (connector == 'R' && adjacentNodeIsAllocated == false){

                    newColumnVal = objNode.tileColumn + 1
                    newRowVal    = objNode.tileRow

                    adjacentNode = g.treeObj[`${prefix}${newColumnVal}-${newRowVal}`]

                    while(adjacentNode == undefined){
                        newColumnVal++
                        adjacentNode = g.treeObj[`${prefix}${newColumnVal}-${newRowVal}`] 
                    }

                    if(adjacentNode.allocated){
                        adjacentNodeIsAllocated = true
                    }

                    // console.log(el(`${prefix}${newColumnVal}-${newRowVal}`));

                } else if (connector == 'D' && adjacentNodeIsAllocated == false){

                    newColumnVal = objNode.tileColumn
                    newRowVal    = objNode.tileRow + 1

                    adjacentNode = g.treeObj[`${prefix}${newColumnVal}-${newRowVal}`]

                    while(adjacentNode == undefined){
                        newRowVal++
                        adjacentNode = g.treeObj[`${prefix}${newColumnVal}-${newRowVal}`] 
                    }

                    if(adjacentNode.allocated){
                        adjacentNodeIsAllocated = true
                    }

                    // console.log(el(`${prefix}${newColumnVal}-${newRowVal}`));

                } else if (connector == 'L' && adjacentNodeIsAllocated == false){

                    newColumnVal = objNode.tileColumn - 1
                    newRowVal    = objNode.tileRow

                    adjacentNode = g.treeObj[`${prefix}${newColumnVal}-${newRowVal}`]

                    while(adjacentNode == undefined){
                        newColumnVal--
                        adjacentNode = g.treeObj[`${prefix}${newColumnVal}-${newRowVal}`] 
                    }

                    if(adjacentNode.allocated){
                        adjacentNodeIsAllocated = true
                    }

                    // console.log(el(`${prefix}${newColumnVal}-${newRowVal}`));

                } 
                  else if (connector == 'RD' && adjacentNodeIsAllocated == false){

                    newColumnVal = objNode.tileColumn + 1
                    newRowVal    = objNode.tileRow + 1

                    adjacentNode = g.treeObj[`${prefix}${newColumnVal}-${newRowVal}`]

                    while(adjacentNode == undefined){
                        newColumnVal++
                        newRowVal++
                        adjacentNode = g.treeObj[`${prefix}${newColumnVal}-${newRowVal}`] 
                    }

                    if(adjacentNode.allocated){
                        adjacentNodeIsAllocated = true
                    }

                    // console.log(el(`${prefix}${newColumnVal}-${newRowVal}`));

                } else if (connector == 'LD' && adjacentNodeIsAllocated == false){

                    newColumnVal = objNode.tileColumn - 1
                    newRowVal    = objNode.tileRow + 1

                    adjacentNode = g.treeObj[`${prefix}${newColumnVal}-${newRowVal}`]

                    while(adjacentNode == undefined){
                        newColumnVal--
                        newRowVal++
                        adjacentNode = g.treeObj[`${prefix}${newColumnVal}-${newRowVal}`] 
                    }

                    if(adjacentNode.allocated){
                        adjacentNodeIsAllocated = true
                    }

                    // console.log(el(`${prefix}${newColumnVal}-${newRowVal}`));

                } else if (connector == 'RT' && adjacentNodeIsAllocated == false){

                    newColumnVal = objNode.tileColumn + 1
                    newRowVal    = objNode.tileRow - 1

                    adjacentNode = g.treeObj[`${prefix}${newColumnVal}-${newRowVal}`]

                    while(adjacentNode == undefined){
                        newColumnVal++
                        newRowVal--
                        adjacentNode = g.treeObj[`${prefix}${newColumnVal}-${newRowVal}`] 
                    }

                    if(adjacentNode.allocated){
                        adjacentNodeIsAllocated = true
                    }

                    // console.log(el(`${prefix}${newColumnVal}-${newRowVal}`));

                } else if (connector == 'LT' && adjacentNodeIsAllocated == false){

                    newColumnVal = objNode.tileColumn - 1
                    newRowVal    = objNode.tileRow - 1

                    adjacentNode = g.treeObj[`${prefix}${newColumnVal}-${newRowVal}`]

                    while(adjacentNode == undefined){
                        newColumnVal--
                        newRowVal--
                        adjacentNode = g.treeObj[`${prefix}${newColumnVal}-${newRowVal}`] 
                    }

                    if(adjacentNode.allocated){
                        adjacentNodeIsAllocated = true
                    }

                    // console.log(el(`${prefix}${newColumnVal}-${newRowVal}`));

                }
                                
            })

        //Update pop-up content
            if(g.treeObj[nodeElem.id].allocated || adjacentNodeIsAllocated == false){

                el('tree-node-popup').innerHTML = `
                    <div>
                        <h4>${upp(node.name)}</h4>
                        <p> ${upp(node.desc)}.</p>
                    </div>
                `
            } 
            else {

                el('tree-node-popup').innerHTML = `
                    <div>
                        <h4>${upp(node.name)}</h4>
                        <p> ${upp(node.desc)}.</p>
                    </div>
                    <button class="btn--ico btn-frame" onclick="addTreeNode('${node.id}', '${nodeElem.id}')">
                        <img src="./03-img/ico/add.svg">
                    </button>
                `
            }
        
        el('tree-node-popup').classList.remove('hide')
    }


//Resolve passive checks
    //After item use
    function resolveAfterBeingHit(){
        g.plObj.treeNodes.forEach(node => {
            if(node.id == 'T24'){

                //Check item type (due to itemless actions)
                if(g.sourceAction.tag.includes('block') == false) return

                console.log(g.plObj.dmgDone, g.plObj.dmgTaken);

                // g.plObj.dmgDone += g.plObj.dmgTaken

                changeStat('life', -g.enObj.dmgDone, 'enemy')

                //Log
                g.logMsg.push(`${node.name}: ${node.desc}`)

            }
        })
    }

//Tree structure
    let treeStructure = [
        // NOTATION for c:
        // T -> top   / col--
        // R -> right / row++
        // D -> down  / col++
        // L -> left  / row--
        // RD -> 45   / row++ col++
        // RT -> 45   / row++ col--
        // LD -> 45   / row-- col++
        // LT -> 45   / row-- col--

        // FORMAT
        // column(x)-row(y)_id_connectors
        // '**-**_G00_T-R-D-L-RT-LT',
        // '**-**_G00_T-R-D'        ,
        // '**-**_G00_T-R'          ,
        // '**-**_G00_T'            ,
        // /*----------------------*/

        // MAP
        // Tree needs corner nodes to be built
        //      1                          2                          3                          4                          5
        /* 1*/ '1-1_S04_R-D'            , /*----------------------*/ /*----------------------*/ /*----------------------*/ '5-1_S05_D-L'            ,
        /* 2*/ /*----------------------*/ /*----------------------*/ /*----------------------*/ /*----------------------*/ /*----------------------*/
        /* 3*/ '1-3_S07_T-D'            , /*----------------------*/ '3-3_S01_T-D'            , /*----------------------*/ '5-3_S08_T-D'            ,
        /* 4*/ /*----------------------*/ /*----------------------*/ /*----------------------*/ /*----------------------*/ /*----------------------*/
        /* 5*/ '1-5_tra_T-D'            , /*----------------------*/ '3-5_S02_T-D'            , /*----------------------*/ '5-5_S06_T-D'            ,
        
        /* 6*/ /*----------------------*/ /*----------------------*/ /*----------------------*/ /*----------------------*/ /*----------------------*/
        /* 7*/ /*----------------------*/ /*----------------------*/ '3-7_S03_T'              , /*----------------------*/ /*----------------------*/
        /* 8*/ /*----------------------*/ /*----------------------*/ /*----------------------*/ /*----------------------*/ /*----------------------*/
        /* 9*/ '1-9_tra_T-R'            , /*----------------------*/ '3-9_tra_L-R'            , /*----------------------*/ '5-9_tra_T-L'            ,
        ]

//Tree node references
//* name: should match .svg icon name
    let treeRef = [

    // Large nodes
        //sq1
        {  id:'S01', name:`Unlock: "Lab: Gravitation"`,
            desc:`Produces relics related to Gravitation.`,
            val:1,
            buildingType: "lab gravitation"
        },
        {  id:'S02', name:`Unlock: "Lab: orbit"`,
            desc:`Produces relics related to orbit.`,
            val:1,
            buildingType: "lab orbit"
        },
        {  id:'S03', name:`Unlock: "Citadel"`,
            desc:`Build Citadel to complete the game.`,
            buildingType: "citadel"
        },
        {  id:'S04', name:`Unlock: "Demolisher"`,
            desc:`Building that allows to demolish other buildings.`,
            val:1,
            buildingType: "demolisher"
        },
        {  id:'S05', name:`Unlock: "Alchemist"`,
            desc:`Building that allows to transmute relics.`,
            val:1,
            buildingType: "alchemist"
        },
        {  id:'S06', name:`Unlock: "Tavern"`,
            desc:`Provides coins.`,
            val:1,
            buildingType: "tavern"
        },
        {  id:'S07', name:`Unlock: "Archeologist"`,
            desc:`Allows you to inspect relics and learn more about them.`,
            val:1,
            buildingType: "archeologist"
        },
        {  id:'S08', name:`Unlock: "Market"`,
            desc:`Allows to trade resources.`,
            val:1,
            buildingType: "market"
        },

    // PLACEHOLDERS
        {  id:'tra', name:'connector' ,
            desc:'connector node provides no passive bonuses',
        },
        {id:'pas', name:'passive' ,
            desc:'description',
        },
        {id:'sta', name:'start' ,
            desc:'description',
        },
    ]