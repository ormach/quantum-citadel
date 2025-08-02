// Open modals on key presses
document.addEventListener('keydown', (event) => {
    if (
        //Check if key matches with initial letter of modal name
        Object.keys(modalsRef).some(key => key.startsWith(event.key))
    ) {

        Object.keys(modalsRef).forEach(key => {
            if(key.startsWith(event.key)){
                toggleModal(key)
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