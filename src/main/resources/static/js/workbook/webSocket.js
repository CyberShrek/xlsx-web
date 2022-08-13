
const webSocket = new WebSocket(`ws://${document.location.host + document.location.pathname}editor`)

webSocket.onmessage