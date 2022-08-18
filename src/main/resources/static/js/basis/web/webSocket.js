const webSocket = new WebSocket(`ws://${document.location.host+document.location.pathname}spreader`)

webSocket.onmessage=(ev) => {
    alert("webSocket: " + ev.data)
}