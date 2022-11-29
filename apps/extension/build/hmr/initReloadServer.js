// build/hmr/initReloadServer.ts
import chokidar from "chokidar";
import { WebSocketServer } from "ws";

// build/log.ts
var COLORS = {
  Reset: "\x1B[0m",
  Bright: "\x1B[1m",
  Dim: "\x1B[2m",
  Underscore: "\x1B[4m",
  Blink: "\x1B[5m",
  Reverse: "\x1B[7m",
  Hidden: "\x1B[8m",
  FgBlack: "\x1B[30m",
  FgRed: "\x1B[31m",
  FgGreen: "\x1B[32m",
  FgYellow: "\x1B[33m",
  FgBlue: "\x1B[34m",
  FgMagenta: "\x1B[35m",
  FgCyan: "\x1B[36m",
  FgWhite: "\x1B[37m",
  BgBlack: "\x1B[40m",
  BgRed: "\x1B[41m",
  BgGreen: "\x1B[42m",
  BgYellow: "\x1B[43m",
  BgBlue: "\x1B[44m",
  BgMagenta: "\x1B[45m",
  BgCyan: "\x1B[46m",
  BgWhite: "\x1B[47m"
};
function colorLog(message, type) {
  let color = type || COLORS.FgBlack;
  switch (type) {
    case "success":
      color = COLORS.FgGreen;
      break;
    case "info":
      color = COLORS.FgBlue;
      break;
    case "error":
      color = COLORS.FgRed;
      break;
    case "warning":
      color = COLORS.FgYellow;
      break;
  }
  console.log(color, message);
}

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

// build/hmr/utils.ts
import { clearTimeout } from "timers";
function debounce(callback, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  };
}

// build/hmr/initReloadServer.ts
var clientsThatNeedToUpdate = /* @__PURE__ */ new Set();
function initReloadServer() {
  const wss = new WebSocketServer({ port: LOCAL_RELOAD_SOCKET_PORT });
  wss.on("connection", (ws) => {
    clientsThatNeedToUpdate.add(ws);
    ws.addEventListener("close", () => clientsThatNeedToUpdate.delete(ws));
    ws.addEventListener("message", (event) => {
      const message = Interpreter.Receive(String(event.data));
      if (message.type === UPDATE_COMPLETE_MESSAGE) {
        ws.close();
      }
    });
  });
  colorLog("Starting Reload Server", "info");
}
chokidar.watch("src").on("all", (event, path) => {
  debounce(sendPendingUpdateMessageToAllSockets, 200)(path);
});
function sendPendingUpdateMessageToAllSockets(path) {
  const _sendPendingUpdateMessage = (ws) => sendPendingUpdateMessage(ws, path);
  clientsThatNeedToUpdate.forEach(_sendPendingUpdateMessage);
}
function sendPendingUpdateMessage(ws, path) {
  ws.send(Interpreter.Send({ type: UPDATE_PENDING_MESSAGE, path }));
}
chokidar.watch(["../../dist/extension/content.js"]).on("all", () => {
  debounce(sendUpdateMessageToAllSockets, 600)();
});
function sendUpdateMessageToAllSockets() {
  clientsThatNeedToUpdate.forEach(sendUpdateMessage);
}
function sendUpdateMessage(ws) {
  ws.send(Interpreter.Send({ type: UPDATE_REQUEST_MESSAGE }));
}
initReloadServer();
