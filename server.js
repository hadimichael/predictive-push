const fs = require('fs');
const spdy = require('spdy');
const express = require('express');

const predictivePush = require('./lib/predictivePush');

const port = 3000;
const app = express();
const options = {
	key: fs.readFileSync('ssl/server.key'),
	cert: fs.readFileSync('ssl/server.crt'),
	ca: fs.readFileSync('ssl/server.csr'),
};

app.use(predictivePush);
app.use('/static', express.static('static'));
app.set('view engine', 'pug')
const viewOptions = {
	index: {
		title: 'Home | Predictive push',
		stylesheets: ['/static/styles.css'],
		message: 'Hello, world!',
		scripts: ['/static/library.js'],
	},
	app: {
		title: 'App',
		stylesheets: [],
		message: 'My app',
		scripts: ['/static/application.js', '/static/library.js'],
	}
}

app.get('/', (req, res) => {
	res.render('template', viewOptions.index);
})

app.get('/app', (req, res) => {
	res.render('template', viewOptions.app);
})

app.get('*', (req, res) => {
    res
      .status(404)
      .send('Not Found')
});

spdy
  .createServer(options, app)
  .listen(port, (error) => {
    if (!!error) {
      console.error(error);
      return process.exit(1);
    } else {
      console.log(`HTTP/2 Server listening on port: ${port}`);
    }
  })
