//Drag and drop 
//Requires any ID for draggable elem
    function allowDrop(ev) {
        ev.preventDefault();
    }
    //Drag card
    function drag(ev) {
        // console.log(ev.target); //logs picked card

        ev.dataTransfer.setData("text/plain", ev.target.id);
        //Make all cards not interactable?
    }
    //Drop card
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
  
  //Manage pages
  function viewScreen(page){
      let pages = document.getElementById('wrapper').querySelectorAll('.page')

      pages.forEach(page => {
          page.classList.add('hide')
      })

      el(page).classList.remove('hide')
  }

  //Show Nav
  function toggleNav(){
      el('nav').classList.toggle('hide')
  }

  let cards = [
      {
          "id": "physics",
          "tags": []    
      },
      {
          "id": "electricity",
          "tags": []    
      },
      {
          "id": "electricity",
          "tags": []    
      }
  ]

  let playerObj = {
      "money": 12,
      "ownedCards": []
  }

  class Card {
    constructor(cardName){
        this.cardId = genId('cr')
        this.name = cardName
    }

    genHtml(){
        let card = document.createElement('div')
        card.classList.add('card')
        card.id = this.cardId
        card.setAttribute('draggable','true')
        card.setAttribute('ondragstart','drag(event)')

        card.innerHTML = `
            <img draggable="false" src="./img/ph-icons/${this.name}.svg" />
            <h2>${this.name}</h2>
            <p>Description</p>        
        `
        return card
    }
  }

  function startGame(){

    [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].forEach(cardId =>{
        let cardTest = new Card(cardId)
        // console.log(cardTest);
        // console.log(cardTest.genHtml());
        
        el('table').append(cardTest.genHtml())
    })
  }
  startGame()