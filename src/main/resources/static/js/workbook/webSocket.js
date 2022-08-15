const webSocket = new WebSocket(`ws://${document.location.host+document.location.pathname}editor/spreader`)

webSocket.onmessage=(ev) => {
    alert(ev)
}