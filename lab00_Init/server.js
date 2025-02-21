const http = require('http');

const html = `
<!doctype html>
<link rel="stylesheet" href="/style.css" />
<script src="script.js"></script>
<h1>Hello, World!</h1>
`;

const css = `
h1 {color: red;}
`;

const javascript = `
alert("Hello, World!");
`;

http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    res.write(html);
  } else if (req.url === '/style.css') {
    res.write(css);
  } else if (req.url === '/script.js') {
    res.write(javascript);
  }
  res.end();
}).listen(3000);
