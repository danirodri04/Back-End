const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const products = [
  { id: 1, name: 'Product 1', price: 10 },
  { id: 2, name: 'Product 2', price: 20 },
  { id: 3, name: 'Product 3', price: 30 },
  { id: 4, name: 'Product 4', price: 40 },
  { id: 5, name: 'Product 5', price: 50 },
  { id: 6, name: 'Product 6', price: 60 },
  { id: 7, name: 'Product 7', price: 70 },
  { id: 8, name: 'Product 8', price: 80 },
  { id: 9, name: 'Product 9', price: 90 },
  { id: 10, name: 'Product 10', price: 100 },
];

app.use(bodyParser.json());
app.use(cors());

// Endpoint para obtener todos los productos
app.get('/products', (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
  const results = products.slice(0, limit);
  res.json(results);
});

// Endpoint para obtener un producto por ID
app.get('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find((p) => p.id === id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

const port = 8080;

app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});
