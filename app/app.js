var express = require('express');
var http = require('http');
var path = require('path');

var app = express();
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '../dist')));

var server = http.createServer(app);
server.listen(port);

var routes = require('./routes.js');
app.use('/api/', routes);

module.exports = app;

function normalizePort(val) {
	var port = parseInt(val, 10);

	if (isNaN(port)) {
		return val;
	}

	if (port >= 0) {
		return port;
	}

	return false;
}
