const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $chat__sidebar = document.querySelector('.chat__sidebar')



//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const renderTemplate=document.querySelector('#render-template').innerHTML

//options
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

//autoscroll
const autoscroll=()=>{
  // New message element
  const $newMessage = $messages.lastElementChild

  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage)
  const newMessageMargin = parseInt(newMessageStyles.marginBottom)
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

  // Visible height
  const visibleHeight = $messages.offsetHeight

  // Height of messages container
  const containerHeight = $messages.scrollHeight

  // How far have I scrolled?
  const scrollOffset = ($messages.scrollTop + visibleHeight)*2;

  if (containerHeight - newMessageHeight < scrollOffset) {
      $messages.scrollTop = $messages.scrollHeight
  }
}


socket.on('message', (message) => {
    console.log(message)
    const html=Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('hh:mm a')
    });
    $messages.insertAdjacentHTML("beforeend",html)
    autoscroll()
})

socket.on("locationMessage",(location)=>{
    const html=Mustache.render(locationTemplate,{
        username:location.username,
        url:location.url,
        createdAt:moment(location.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML("beforeend",html)
    autoscroll()
})

//Room details renderong
socket.on("roomData",({roomName,roomDetails})=>{
    console.log(roomDetails);
 
    const html=Mustache.render(renderTemplate,{roomName,roomDetails})
    $chat__sidebar.innerHTML=html;


})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }

        console.log('Message delivered!')
    })
})

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared!')  
        })
    })
})

socket.emit('join',{username,room},(error)=>{
    if(error) {
    alert(error)
    location.href="/"
    }
})