const express = require('express');
const app = express();

app.use(require('./product'));
app.use(require('./category'));
app.use(require('./user'));
app.use(require('./login'));

module.exports = app;