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
});
