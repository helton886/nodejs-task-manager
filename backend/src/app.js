require('./db/mongoose');
const express = require('express');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();

//app config
app.use(express.json());

//setting routers
app.use(userRouter);
app.use(taskRouter);

module.exports = app;
