const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const expressHandlebars = require('express-handlebars').create();


const app = express();
const server = http.createServer(app);
const io = socketIO(server);


app.engine('handlebars', expressHandlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.static('public'));


// Rutas y middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const products = [];


app.get('/', (req, res) => {
    res.render('home', { products });
});


app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products });
});


// Manejo de eventos de WebSocket
io.on('connection', (socket) => {
    console.log('a user connected');


    socket.on('newProduct', (product) => {
        products.push(product);
        io.emit('updateProducts', products);
    });


    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});


// Iniciar el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
