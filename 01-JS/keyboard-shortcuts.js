// Open modals on key presses
document.addEventListener('keydown', (event) => {
    console.log(Object.keys(modalsRef).some(key => key.startsWith(event.key)));
    

    if (
        //Check if key matches with initial letter of modal name
        Object.keys(modalsRef).some(key => key.startsWith(event.key))
    ) {

        Object.keys(modalsRef).forEach(key => {

            if(key.startsWith(event.key)){
                console.log(`Modal found for key: ${el(key)}`);
                toggleModal(key)
            }

            else{
                console.log(`No modal found for key: ${event.key}`);
                return
            }
        })
    }

    //Hide all on 'Q'
    else if (event.key === 'q' || event.keyCode === 27) {
        let modals = document.querySelectorAll('.modal')

        modals.forEach(modal => {
            modal.classList.add('hide')
        })
    }

    //Flip projection
    else if (event.key === 'f' && g.gameMap.buildMode) {
        g.gameMap.buildings[g.gameMap.focusedBuilding].flipX = true
        g.gameMap.focusedBuildingHtmlElem.classList.toggle('flipX')
    }
});