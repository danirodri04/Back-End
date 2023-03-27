class ProductManager {
    constructor() {
        this.events = []
        this.index = 0
    }

    getProducts = () => {
        return this.events;
    }

    addProduct = (title, description, price, thumbnail, code, stock) => {
        const existingProduct = this.events.find((product) => product.code === code);
        if (existingProduct) {
            throw new Error("Product with the same code already exists");
        }
        this.index++;
        const id = this.index;
        const product = {id, title, description, price, thumbnail, code, stock };
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
            throw new Error("Missing required fields");
        }
        this.events.push(product);
        return product;
    }

    listEvents = () => {
        console.log("Product list:");
        this.events.forEach(product => {
            console.log(`ID: ${product.id} - ${product.title} (${product.price} pesos)`);
        });
    }

    getProductById = (id) => {
        const product = this.events.find((product) => product.id === id);
        if (!product) {
            console.error("Not found");
            return null;
        }
        return product;
    }
}

const manager = new ProductManager();

console.log(manager.getProducts()); 
const newProduct = manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
console.log(newProduct); 
console.log(manager.getProducts()); 
try {
    manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
} catch (error) {
    console.error(error.message); 
}

const productById = manager.getProductById(1);
console.log(productById); 
const nonExistentProductById = manager.getProductById(999);
console.log(nonExistentProductById);