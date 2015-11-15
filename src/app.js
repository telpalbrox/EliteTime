'use strict';
let Backbone = require('backbone');
let AppView = require('./views/AppView');
let Router = require('./router');
document.body.onload = function() {
	global.router = new Router();
	Backbone.history.start();
};
