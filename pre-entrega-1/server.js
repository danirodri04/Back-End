const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const productosRouter = express.Router();

productosRouter.get('/', async (req, res) => {
  const { limit } = req.query;
  let productos = JSON.parse(await leerArchivoJson('productos.json'));
  if (limit) {
    productos = productos.slice(0, limit);
  }
  res.json(productos);
});

productosRouter.get('/:pid', async (req, res) => {
  const { pid } = req.params;
  const productos = JSON.parse(await leerArchivoJson('productos.json'));
  const producto = productos.find(p => p.id === pid);
  if (producto) {
    res.json(producto);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

productosRouter.post('/', async (req, res) => {
  const nuevoProducto = req.body;
  const productos = JSON.parse(await leerArchivoJson('productos.json'));
  nuevoProducto.id = uuidv4(); // generamos un id único para el nuevo producto
  nuevoProducto.status = true; // establecemos el valor por defecto de status
  if (!nuevoProducto.thumbnails) {
    nuevoProducto.thumbnails = [];
  }
  productos.push(nuevoProducto);
  await escribirArchivoJson('productos.json', productos);
  res.json(nuevoProducto);
});

app.use('/api/productos', productosRouter);

const carritosRouter = express.Router();

carritosRouter.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  const carrito = JSON.parse(await leerArchivoJson('carrito.json'));
  const productos = JSON.parse(await leerArchivoJson('productos.json'));
  const carritoProductos = carrito.products || [];
  const carritoProductosInfo = carritoProductos.map((pid) => productos.find(p => p.id === pid));
  res.json(carritoProductosInfo);
});

carritosRouter.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const carrito = JSON.parse(await leerArchivoJson('carrito.json'));
  const productos = JSON.parse(await leerArchivoJson('productos.json'));
  const carritoProductos = carrito.products || [];
  if (!carritoProductos.includes(pid)) {
    carritoProductos.push(pid);
    await escribirArchivoJson('carrito.json', { ...carrito, products: carritoProductos });
  }
  res.json({ message: 'Producto agregado al carrito' });
});

app.use('/api/carritos', carritosRouter);

async function leerArchivoJson(nombreArchivo) {
  const data = await fs.readFile(nombreArchivo, 'utf-8');
  return data;
}
