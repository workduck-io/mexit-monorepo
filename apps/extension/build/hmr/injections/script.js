// build/hmr/constant.ts
var LOCAL_RELOAD_SOCKET_PORT = 8081;
var LOCAL_RELOAD_SOCKET_URL = `ws://localhost:${LOCAL_RELOAD_SOCKET_PORT}`;
var UPDATE_PENDING_MESSAGE = "wait_update";
var UPDATE_REQUEST_MESSAGE = "do_update";
var UPDATE_COMPLETE_MESSAGE = "done_update";

// build/hmr/interpreter.ts
var Interpreter = {
  Send: send,
  Receive: receive
};
function send(message) {
  return JSON.stringify(message);
}
function receive(message) {
  return JSON.parse(message);
}

// build/hmr/initReloadClient.ts
var needToUpdate = false;
function initReloadClient({
  watchPath,
  onUpdate
}) {
  const socket = new WebSocket(LOCAL_RELOAD_SOCKET_URL);
  function sendUpdateCompleteMessage() {
    socket.send(Interpreter.Send({ type: UPDATE_COMPLETE_MESSAGE }));
  }
  socket.addEventListener("message", (event) => {
    const message = Interpreter.Receive(String(event.data));
    switch (message.type) {
      case UPDATE_REQUEST_MESSAGE: {
        if (needToUpdate) {
          sendUpdateCompleteMessage();
          needToUpdate = false;
          onUpdate();
        }
        return;
      }
      case UPDATE_PENDING_MESSAGE: {
        needToUpdate = checkUpdateIsNeeded({
          watchPath,
          updatedPath: message.path
        });
        return;
      }
    }
  });
  return socket;
}
function checkUpdateIsNeeded({ watchPath, updatedPath }) {
  return updatedPath.includes(watchPath);
}

// build/hmr/injections/script.ts
function addHmrIntoScript(watchPath) {
  initReloadClient({
    watchPath,
    onUpdate: () => {
      chrome.runtime.reload();
    }
  });
}
export {
  addHmrIntoScript as default
};
