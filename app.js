const express = require('express');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');
const logger = require('morgan');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const api_router = require('./routes/api');
const app = express();

const config = require('./modules/config');

// session
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const db = require('./db');
const MongoStore = require('connect-mongo')(session);
// ====

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(helmet());
app.use(compression());
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

app.use(logger('dev'));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({extended: false, limit: '5mb'}));
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/_API', express.static('_API'));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Token, Locale,auth_data");
    next();
});


app.use(cookieParser());


app.use(session({
    secret: config.get('server:session:secret'),
    name: config.get('server:session:name'),
    cookie: {
        // secure : false,
        // domain:'localhost:3002',
        maxAge: config.get('server:session:ttl_hours') * 60 * 60 * 1000 // hours
    },
    httpOnly: true,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({mongooseConnection: mongoose.connection, stringify: false})
}));

app.use('/', (req, res) => {
    return res.render('index', {title: 'Service'});
});

//api router
app.use('/v1', api_router);

app.get('/export/insomnia', (req, res) => {
    res.download(path.resolve('./_docs/insomnia.json'));
});
app.get('/export/postman', (req, res) => {
    res.download(path.resolve('./_docs/postman.postman_collection'));
});
//api router


// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


app.listen(config.get('server:port') || 3001, () => {
    console.log('Port ' + (config.get('server:port') || 3001));
});