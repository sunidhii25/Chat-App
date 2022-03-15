const express = require('express');
const app = express();

const path = require('path');

const session = require('express-session');
const flash = require('connect-flash');

const mongoose = require('mongoose');
const db = require('./config/mongoose');

//getting passport middleware
const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('./models/user')

//routes
const authRoutes = require('./routes/authRoutes');


// For Socket
const http = require('http');
const server = http.createServer(app);

//setting up socket.io
const socketio = require('socket.io');
const { SocketAddress } = require('net');
const io = socketio(server);



//setting up view  engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname , 'assets')));

app.use(express.urlencoded({extended:true}));

sessionConfig = {
    secret: 'weneedsomebettersecret',
    resave: false,
    saveUninitialized: true
}

// MiddleWares

app.use(session(sessionConfig));
app.use(flash());


app.use((req, res, next) => {
    
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currectUser = req.user;
    next();
});






app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(authRoutes);














const users={}   


io.on('connection', (socket) => {

  
    
    socket.on('send_msg', (data) => {

        //console.log(users[socket.id]);
        io.emit('recieved_msg', {
            msg: data.msg,
            user: data.user
        })

    });

    socket.on('login', (data) => {
        users[socket.id] = data.user;    
    });

});













server.listen(3000, () => {
    console.log('server running at port 3000');
})