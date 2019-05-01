const express = require('express');
const hbs = require('hbs');
const path = require('path');
const app = express();
require('./database')
const port = process.env.PORT || 3000;
const { ensureAuthenticated } = require('./config/auth');

//chat client config
const socket = require("socket.io");



const passport = require('passport');

//passport config
require('./config/passport')(passport);
// static file directory 
app.use(express.static(path.join(__dirname,'/public')));


// Template Engine
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '/views'));

//partials directory
hbs.registerPartials(path.join(__dirname, '/partials'));

//BodyParser
app.use(express.urlencoded({ extended: false }));


// express middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res)=>{
    res.render('index');
});
app.use('/users', require("./routes/users"));

app.get('/home',(req, res)=>{
    res.render('home');
});

app.get('/chat', (req, res)=>{
    res.render('chat');
});

const server = app.listen(port,()=>{
    console.log('Server is running on port ' + port);
});

// Socket 
var io = socket(server);

io.on("connection", function(socket){
	console.log("User connected", socket.id);
	socket.on("chat", function(data){

		io.sockets.emit("chat", data);
	});

	socket.on('typing', function(data){
		socket.broadcast.emit('typing', data);

	});
})