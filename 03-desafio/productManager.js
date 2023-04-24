const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async addProduct(product) {
    const products = await this.getProducts();
    const newProduct = { id: products.length + 1, ...product };
    products.push(newProduct);
    await this.writeProductsToFile(products);
    return newProduct;
  }

  async getProducts() {
    try {
      const data = await fs.promises.readFile(this.path);
      return JSON.parse(data.toString());
    } catch (error) {
      return [];
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(product => product.id === id);
  }

  async updateProduct(id, fieldsToUpdate) {
    const products = await this.getProducts();
    const productIndex = products.findIndex(product => product.id === id);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }
    const updatedProduct = { ...products[productIndex], ...fieldsToUpdate };
    products[productIndex] = updatedProduct;
    await this.writeProductsToFile(products);
    return updatedProduct;
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const filteredProducts = products.filter(product => product.id !== id);
    await this.writeProductsToFile(filteredProducts);
  }

  async writeProductsToFile(products) {
    await fs.promises.writeFile(this.path, JSON.stringify(products));
  }
}