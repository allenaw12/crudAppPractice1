const update = document.querySelector('#update-button')
const deleteButton = document.querySelector('#delete-button')
const messageDiv = document.querySelector('#message')

update.addEventListener('click', _ => {
    fetch('/quotes', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            name: 'Rexy',
            quote: 'Rawwrrrr!'
        })
    })
    .then(response => {
        if(response.ok) return response.json()
    })
    .then(response => {
        console.log(response)
    })
})

deleteButton.addEventListener('click', _ => {
    fetch('/quotes', {
        method: 'delete',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            name: 'Rexy'
        })
    })
    .then(response => {
        if (response.ok) return response.json()
    })
    .then(response => {
        if(response === 'no roar to delete') {
            messageDiv.textContent = 'No roars remain...'
        }else{
            window.location.reload()
        }
    })
    .catch(error => console.error(error))
})