import './App.css'
import { useState, useEffect } from 'react'

function App() {

  const [cart, setCart] = useState([])

  const [products, setProducts] = useState([])

  const [search, setSearch] = useState('')

  const [name, setName] = useState('')

  const [price, setPrice] = useState('')

  const [image, setImage] = useState('')

  const [username, setUsername] = useState('')

  const [password, setPassword] = useState('')

  const [message, setMessage] = useState('')

  const fetchProducts = () => {

    fetch('http://127.0.0.1:5000/products')

      .then((response) => response.json())

      .then((data) => {
        setProducts(data)
      })
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const addToCart = (product) => {
    setCart([...cart, product])
  }

  const removeFromCart = (indexToRemove) => {

    const updatedCart = cart.filter(
      (_, index) => index !== indexToRemove
    )

    setCart(updatedCart)
  }

  const addProduct = () => {

    fetch('http://127.0.0.1:5000/add-product', {

      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        name,
        price,
        image
      })

    })

      .then((response) => response.json())

      .then(() => {

        fetchProducts()

        setName('')
        setPrice('')
        setImage('')
      })
  }

  const signup = () => {

    fetch('http://127.0.0.1:5000/signup', {

      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        username,
        password
      })

    })

      .then((response) => response.json())

      .then((data) => {
        setMessage(data.message)
      })
  }

  const login = () => {

    fetch('http://127.0.0.1:5000/login', {

      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        username,
        password
      })

    })

      .then((response) => response.json())

      .then((data) => {
        setMessage(data.message)
      })
  }

  const placeOrder = () => {

    fetch('http://127.0.0.1:5000/place-order', {

      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(cart)

    })

      .then((response) => response.json())

      .then((data) => {

        setMessage(data.message)

        setCart([])
      })
  }

  const totalPrice = cart.reduce(
    (total, item) => total + item.price,
    0
  )

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(
      search.toLowerCase()
    )
  )

  return (
    <div>

      <nav>
        <h1>Trendora</h1>
        <p>Cart 🛒 {cart.length}</p>
      </nav>

      <section>

        <h2>Login / Signup</h2>

        <div className="admin-form">

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={signup}>
            Signup
          </button>

          <button onClick={login}>
            Login
          </button>

          <p>{message}</p>

        </div>

        <h2>Admin Add Product</h2>

        <div className="admin-form">

          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            type="text"
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />

          <button onClick={addProduct}>
            Add Product
          </button>

        </div>

        <h2>Latest Products</h2>

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />

        <div className="product-container">

          {filteredProducts.map((product) => (

            <div className="product-card" key={product.id}>

              <img
                src={product.image}
                alt={product.name}
              />

              <h3>{product.name}</h3>

              <p>₹{product.price}</p>

              <button
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>

            </div>

          ))}

        </div>

        <div className="cart-section">

          <h2>Your Cart</h2>

          {cart.length === 0 ? (
            <p>Cart is empty</p>
          ) : (
            <>
              {cart.map((item, index) => (

                <div className="cart-item" key={index}>

                  <div>
                    <p>{item.name}</p>
                    <p>₹{item.price}</p>
                  </div>

                  <button
                    onClick={() => removeFromCart(index)}
                  >
                    Remove
                  </button>

                </div>

              ))}

              <h3>Total: ₹{totalPrice}</h3>

              <button onClick={placeOrder}>
                Place Order
              </button>

            </>
          )}

        </div>

      </section>

    </div>
  )
}

export default App