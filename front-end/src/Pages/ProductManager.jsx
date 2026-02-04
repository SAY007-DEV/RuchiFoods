import React, { useState } from 'react';

const ProductManager = () => {
  const [products, setProducts] = useState([
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
  });

  const [editingId, setEditingId] = useState(null);
  const [editProduct, setEditProduct] = useState({});

  
  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price && newProduct.quantity) {
      const product = {
        id: Date.now(), 
        ...newProduct,
        price: parseFloat(newProduct.price),
        quantity: parseInt(newProduct.quantity),
      };
      setProducts([...products, product]);
      setNewProduct({ name: '', description: '', price: '', quantity: '' });
    }
  };


  const handleEditProduct = (id) => {
    const product = products.find((p) => p.id === id);
    setEditingId(id);
    setEditProduct({ ...product });
  };

  
  const handleSaveEdit = () => {
    setProducts(products.map((p) => (p.id === editingId ? { ...editProduct } : p)));
    setEditingId(null);
    setEditProduct({});
  };


  const handleCancelEdit = () => {
    setEditingId(null);
    setEditProduct({});
  };

 
  const handleDeleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Product Manager for Invoices</h1>

      {/* Add Product Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newProduct.quantity}
            onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleAddProduct}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Quantity</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                {editingId === product.id ? (
                  <>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={editProduct.name}
                        onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                        className="border border-gray-300 rounded p-1 w-full"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={editProduct.description}
                        onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                        className="border border-gray-300 rounded p-1 w-full"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={editProduct.price}
                        onChange={(e) => setEditProduct({ ...editProduct, price: parseFloat(e.target.value) })}
                        className="border border-gray-300 rounded p-1 w-full"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={editProduct.quantity}
                        onChange={(e) => setEditProduct({ ...editProduct, quantity: parseInt(e.target.value) })}
                        className="border border-gray-300 rounded p-1 w-full"
                      />
                    </td>
                    <td className="px-4 py-2">${(editProduct.price * editProduct.quantity).toFixed(2)}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={handleSaveEdit}
                        className="bg-green-500 text-white px-2 py-1 rounded mr-2 hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-2">{product.name}</td>
                    <td className="px-4 py-2">{product.description}</td>
                    <td className="px-4 py-2">${product.price.toFixed(2)}</td>
                    <td className="px-4 py-2">{product.quantity}</td>
                    <td className="px-4 py-2">${(product.price * product.quantity).toFixed(2)}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleEditProduct(product.id)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="text-center py-8 text-gray-500">No products added yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProductManager;