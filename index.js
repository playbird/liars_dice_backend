import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './src/components/App';

const server = express();
server.use(express.static('public'));

server.get('/', (req, res) => {
  const initialMarkup = ReactDOMServer.renderToString(<App />);

  res.send(`
    <html>
      <head>
        <title>Sample React App</title>
      </head>
      <body>
        <div id="mountNode">${initialMarkup}</div>
        <script src="bundle.js"></script>
      </body>
    </html>
  `)
});

server.listen(5000, () => console.log('Server is running...'));
