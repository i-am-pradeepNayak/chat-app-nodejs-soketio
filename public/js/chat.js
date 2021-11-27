const socket = io();

const form = document.getElementById("formBox");
const input = document.getElementById("ip1");
const location1 = document.getElementById("location");
const button = document.querySelector("button");

//welcome msg
socket.on("sendMsg", (data) => {
  button.disabled = false;
  input.focus();
  console.log(data);
});

socket.on("shareLocation", (data) => {
  console.log("location", data);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  button.disabled = true;
  

  socket.emit("input", input.value, (msg) => {
    console.log(msg);
    input.value = "";
  });
});

location1.addEventListener("click", (e) => {
    location1.setAttribute("disabled","true")
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "location",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      (data) => {
        console.log(data);
        location1.removeAttribute("disabled");
      }
    );
  });
});
