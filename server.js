const fs = require('fs');
const spdy = require('spdy');
const express = require('express');

const predictivePushOptions = {
	confidenceThreshold: 0.24,
	rootDir: __dirname,
	staticRoute: '/static',
};

const predictivePush = require('./lib/predictivePush')(predictivePushOptions);

const port = 3000;
const app = express();
const options = {
	key: fs.readFileSync('ssl/server.key'),
	cert: fs.readFileSync('ssl/server.crt'),
	ca: fs.readFileSync('ssl/server.csr'),
};

app.use(predictivePush);
app.use(predictivePushOptions.staticRoute, express.static('static'));
app.set('view engine', 'pug');

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
		message: 'My App',
		scripts: ['/static/application.js', '/static/library.js'],
	},
	superApp: {
		title: 'Super App',
		stylesheets: ['/static/styles.css'],
		message: 'My Super App',
		scripts: ['/static/application.js', '/static/library.js', '/static/bundle.js'],
	}
};

app.get('/', (req, res) => {
	res.render('template', viewOptions.index);
});

app.get('/app', (req, res) => {
	res.render('template', viewOptions.app);
});

app.get('/admin', (req, res) => {
	res.render('template', viewOptions.superApp);
});

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
  });
