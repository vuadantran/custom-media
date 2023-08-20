const express = require('express');
const {
  YoutubeTranscript
} = require('youtube-transcript');
var http = require('http');
var fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const url = require('url');


server = http.createServer(async function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');


  if (req.url.startsWith('/')) {
    try {
      const parsedUrl = url.parse(req.url, true); // Parse the URL including query parameters
      const queryParameters = parsedUrl.query;    // Extract query parameters object
    
      // Access individual query parameters
      const videoId = queryParameters.videoId; 
      console.log('Receive videoId: ' + videoId) 
      data = await loadScripts(videoId).then((res) => {return res});
      // console.log(data)
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify(data));
      res.end();
          
    } catch (e) {
      res.writeHead(503,  { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({'Attr': 'name: ' + e.name + ' message: ' + e.message + ' at: ' + e.at + ' text: ' + e.text, "Error": e.stack}))
    }
  } else {
    res.writeHead(404);
    res.end('Not phao!')
  }
})
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});


async function loadScripts(videoId) {

  const config = {
      lang: 'en',
      country: 'EN'
  };

  const scripts = await YoutubeTranscript.fetchTranscript(videoId, config).then((res) => {
      return res
  });
  return scripts;
}


const app = express();

app.get('/', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/html'
});
  const filePath = path.join(__dirname, 'index.html');
  fs.readFile(filePath, 'utf-8', function(err, content) {
    res.end(content);
    dom = new JSDOM(content, {
      url: "http://localhost:3000/",
      contentType: "text/html",
      pretendToBeVisual: true,
    })
    // document = dom.window.document;
    res.send(dom.serialize());
    res.end()
})
});

// app.listen(8080, () => {
//   console.log('Example app listening at http://localhost:8080');
// });