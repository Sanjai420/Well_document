const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/submit') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      // Parse the JSON data received from the request
      const jsonData = JSON.parse(body);
        
      // Log the parsed JSON data
      console.log(jsonData);

      // Write the JSON data to a file
      fs.writeFile('data.json', JSON.stringify(jsonData), (error) => {
        if (error) {
          res.writeHead(500);
          res.end('Error saving data');
        } else {
          // Send a "Thank you" response
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Thank you for submitting the form');
        }
      });
    });
  } else {
    let filePath = '.' + req.url;
    if (filePath === './') {
      filePath = './index.html';
    }

    const extname = path.extname(filePath);
    let contentType = 'text/html';

    switch (extname) {
      case '.css':
        contentType = 'text/css';
        break;
      case '.js':
        contentType = 'text/javascript';
        break;
    }

    fs.readFile(filePath, (error, content) => {
      if (error) {
        if (error.code === 'ENOENT') {
          res.writeHead(404);
          res.end('File not found');
        } else {
          res.writeHead(500);
          res.end('Server error');
        }
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
