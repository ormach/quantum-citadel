//Drag and drop 
//Requires any ID for draggable elem
  function allowDrop(ev) {
    ev.preventDefault();
  }
  
  function drag(ev) {
    // console.log(ev.target); //logs picked card

    ev.dataTransfer.setData("text/plain", ev.target.id);
    //Make all cards not interactable?
  }
  
  function drop(ev) {
    ev.preventDefault();
    console.log(ev.target);

    var data = ev.dataTransfer.getData("text/plain");

    if(ev.target.classList.contains('card')){
        console.log(1);
        ev.target.parentNode.appendChild(document.getElementById(data));
    }
    //Prevents targeting elems in the card.
    //See if there is a way to fix this.
    else if (ev.target.parentNode.classList.contains('card')){
        ev.target.parentNode.parentNode.appendChild(document.getElementById(data));
    }
    else{
        ev.target.appendChild(document.getElementById(data));
    }
  }