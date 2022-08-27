let ramen = []


const ramenDets = document.querySelector(`#ramen-detail`)


document.addEventListener('DOMContentLoaded', event => {
    getRamens()
    document.querySelector(`#new-ramen`).addEventListener(`submit`, (event) => submitForm(event))
    document.querySelector(`#deleteButton`).addEventListener(`click`, (event) => deleteRamen(event))
})


function getRamens() {
    fetch('http://localhost:3000/ramens')
    .then(resp => resp.json())
    .then(data => data.forEach(ramenObj => addRamens(ramenObj)))
    .then(undef => presentRandomRamen())
}

function addRamens(ramenObject) {
    const img = document.createElement('img')
    img.src = ramenObject.image 
    img.addEventListener(`click`, (event) => showSelectRamen(event))
    document.querySelector(`#ramen-menu`).appendChild(img)
    ramenObject.imgElement = img
    ramen.push(ramenObject)
}

function showSelectRamen(event) {
    const ramenObject = ramen.find(element => element.imgElement === event.target)
    ramenDets.querySelector(`img`).src = ramenObject.image
    ramenDets.querySelector(`h2`).textContent = ramenObject.name
    ramenDets.querySelector(`h3`).textContent = ramenObject.restaurant
    document.querySelector(`#rating-display`).textContent = ramenObject.rating
    document.querySelector(`#comment-display`).textContent = ramenObject.comment
}

function submitForm(event)  {
    event.preventDefault()
    const newObject = {
        name: event.target.querySelector(`#new-name`).value,
        restaurant: event.target.querySelector(`#new-restaurant`).value,
        image: event.target.querySelector(`#new-image`).value,
        rating: parseInt(event.target.querySelector(`#new-rating`).value, 10),
        comment: event.target.querySelector(`#new-comment`).value,
    }
    event.target.reset()
    postRamen(newObject)
}

function postRamen(newObject) {
    const postObj = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newObject)
    }
    fetch(`http://localhost:3000/ramens`, postObj)
    .then(resp => resp.json())
    .then(data => addRamens(data))
}

function deleteRamen(event) {
    event.preventDefault()
    const deletedRamen = ramen.find(ramen => ramen.name === document.querySelector(`#ramen-detail h2`).textContent)
    sendDelete(deletedRamen)
    removeFromDOM(deletedRamen)
}


function sendDelete(deletedRamen) {
    const deleteObj = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    fetch(`http://localhost:3000/ramens/${deletedRamen.id}`, deleteObj)
}

function removeFromDOM(deletedRamen) {
    document.querySelector(`#ramen-menu`).removeChild(deletedRamen.imgElement)
    ramen = ramen.filter(ramen => ramen !== deletedRamen)
    presentRandomRamen()
}


