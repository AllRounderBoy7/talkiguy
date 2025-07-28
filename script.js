const socket = io();
const login = document.getElementById("login");
const chat = document.getElementById("chat");
const usernameInput = document.getElementById("username");
const messageInput = document.getElementById("messageInput");
const messages = document.getElementById("messages");
const usersList = document.getElementById("usersList");
const onlineCount = document.getElementById("onlineCount");

function joinChat() {
  const username = usernameInput.value.trim();
  if (!username) return alert("Enter a name");
  socket.emit("join", username);
  login.classList.add("hidden");
  chat.classList.remove("hidden");
}

function sendMessage() {
  const message = messageInput.value.trim();
  if (!message) return;
  socket.emit("message", { message });
  messageInput.value = "";
}

messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

socket.on("message", (data) => {
  const div = document.createElement("div");
  div.textContent = `${data.user}: ${data.message}`;
  div.className = "bg-white/20 px-2 py-1 rounded cursor-pointer";
  div.addEventListener("mousedown", () => {
    setTimeout(() => socket.emit("delete", data.message), 500);
  });
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
});

socket.on("delete", (msgId) => {
  [...messages.children].forEach((div) => {
    if (div.textContent.includes(msgId)) div.remove();
  });
});

socket.on("users", (users) => {
  usersList.innerHTML = users.map(user => `<span class='bg-blue-600 rounded px-2 py-1'>${user}</span>`).join("");
  onlineCount.textContent = users.length;
});