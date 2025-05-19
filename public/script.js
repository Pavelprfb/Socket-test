const socket = io();
const input = document.getElementById("msg");
const messages = document.getElementById("messages");

function createMessageElement(msgObj) {
  const div = document.createElement("div");
  div.className = "message";
  div.setAttribute("data-id", msgObj._id);
  div.innerHTML = `
  <div class="flex">
    <span class="latestMsg">${msgObj.text}</span>
    <div class="actions">
      <button onclick="copyText('${msgObj.text}')">Copy</button>
      <button onclick="deleteMessage('${msgObj._id}', this)">Delete</button>
    </div>
  </div>
  `;
  messages.prepend(div);
}

function send() {
  const text = input.value.trim();
  if (text) {
    socket.emit("message", text);
    input.value = "";
  }
}

socket.on("message", (msgObj) => {
  createMessageElement(msgObj);
});

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => alert("Copied!"));
}

function deleteMessage(id, btn) {
  if (confirm("Are you sure?")) {
    fetch(`/delete/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => {
        btn.closest(".message").remove();
      });
  }
}

fetch("/messages")
  .then((res) => res.json())
  .then((data) => data.forEach(createMessageElement));