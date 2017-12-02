self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js');

self.onmessage = function (event) { 
  var input = event.data
  if (typeof input !== 'string') {
    input = JSON.stringify(input, null, 2)
  }

  var result = self.hljs.highlightAuto(input)
  self.postMessage(result.value)
}