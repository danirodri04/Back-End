const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas de productos
const productosRouter = express.Router();

productosRouter.get('/', async (req, res) => {
  const { limit } = req.query;
  let productos = JSON.parse(await leerArchivoJson('productos.json'));
  if (limit) {
    productos = productos.slice(0, limit);
  }
  res.json(productos);
});

productosRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  const productos = JSON.parse(await leerArchivoJson('productos.json'));
  const producto = productos.find(p => p.id === id);
  if (producto) {
    res.json(producto);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

productosRouter.post('/', async (req, res) => {
  const nuevoProducto = req.body;
  const productos = JSON.parse(await leerArchivoJson('productos.json'));
  nuevoProducto.id = uuidv4();
  nuevoProducto.status = true;
  if (!nuevoProducto.thumbnails) {
    nuevoProducto.thumbnails = [];
  }
  productos.push(nuevoProducto);
  await escribirArchivoJson('productos.json', productos);
  res.json(nuevoProducto);
});

productosRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const productos = JSON.parse(await leerArchivoJson('productos.json'));
  const index = productos.findIndex(p => p.id === id);
  if (index !== -1) {
    productos[index] = { ...productos[index], ...req.body, id };
    await escribirArchivoJson('productos.json', productos);
    res.json(productos[index]);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

productosRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const productos = JSON.parse(await leerArchivoJson('productos.json'));
  const index = productos.findIndex(p => p.id === id);
  if (index !== -1) {
    productos.splice(index, 1);
    await escribirArchivoJson('productos.json', productos);
    res.json({ message: 'Producto eliminado' });
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

app.use('/api/productos', productosRouter);

// Rutas de carritos
const carritosRouter = express.Router();

carritosRouter.get('/:carritoId', async (req, res) => {
  const { carritoId } = req.params;
  const carrito = JSON.parse(await leerArchivoJson('carrito.json'));
  const productos = JSON.parse(await leerArchivoJson('productos.json'));
  const carritoProductos = carrito.products || [];
  const carritoProductosInfo = carritoProductos.map((id) => productos.find(p => p.id === id));
  res.json(carritoProductosInfo);
});

carritosRouter.post('/', async (req, res) => {
  const nuevoCarrito = { id: uuidv4(), products: [] };
  await escribirArchivoJson('carrito.json', nuevoCarrito);
  res.json(nuevoCarrito);
});

carritosRouter.post('/:carritoId/product/:productoId', async (req, res) => {
  const { carritoId, productoId } = req.params;
  const carrito = JSON.parse(await leerArchivoJson('carrito.json'));
  const productos = JSON.parse(await leerArchivoJson('productos.json'));
  const producto = productos.find(p => p.id === productoId);
  
  if (!producto) {
  res.status(404).json({ error: 'Producto no encontrado' });
  return;
  }
  
  const carritoProductos = carrito.products || [];
  const index = carritoProductos.indexOf(productoId);
  
  if (index !== -1) {
  res.status(400).json({ error: 'El producto ya existe en el carrito' });
  return;
  }
  
  carrito.products = [...carritoProductos, productoId];
  await escribirArchivoJson('carrito.json', carrito);
  res.json(carrito);
  });
  
  // Iniciar el servidor en el puerto 8080
  app.listen(8080, () => {
  console.log('Servidor iniciado en el puerto 8080');
  });
  
  async function leerArchivoJson(nombreArchivo) {
  try {
  const contenido = await fs.readFile(nombreArchivo, 'utf-8');
  return contenido;
  } catch (error) {
  await escribirArchivoJson(nombreArchivo, []);
  return '[]';
  }
  }
  
  async function escribirArchivoJson(nombreArchivo, contenido) {
  await fs.writeFile(nombreArchivo, JSON.stringify(contenido, null, 2));
  }
  
  module.exports = app;