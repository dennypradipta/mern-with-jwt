const express = require('express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    helmet = require('helmet'),
    cors = require('cors');

const indexRouter = require('./routes/index'),
    usersRouter = require('./routes/users'),
    todoRouter = require('./routes/todos');

const app = express();

app.use(helmet());
app.use(cors({credentials: true, origin: 'http://localhost:3001'}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/api/user', usersRouter);
app.use('/api/todo', todoRouter);

module.exports = app;
