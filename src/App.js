import React, { useEffect, useState } from 'react'
import Shopping from './shopping/Shopping'
import { HashRouter as Router, Routes, Route, useParams } from 'react-router-dom'
import Navigation from './navigation/Navigation'
import Product from './product/Product'
import Cart from './cart/cart'
import { commerce } from './commerce/commerce'
import Homepage from './homepage/homepage'
import Checkout from './checkout/Checkout'
import Orders from './profile/Orders'
import Login from './login/Login'


function App() {

  const [cartItems, setItems] = useState([])
  const [cart, setCart] = useState()
  const [order, setOrder] = useState({})
  const [errorMessage, setErrorMessage] = useState('')

  
  useEffect(() => {
    
    const fetchData = async () => {
      await commerce.cart.contents().then((data) => setItems(data))
    }
    
    const fetchCart = async () => {
      setCart(await commerce.cart.retrieve())
    }

    fetchData()
    fetchCart()

  }, [cart])

  const { productID } = useParams()
  
  const [products, setProducts] = useState([])

  const fetchProducts = async () => {
    const {data} = await commerce.products.list()
    setProducts(data)
    console.log(data);
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const refreshCart = async () => {
    const newCart = await commerce.cart.refresh()

    setCart(newCart)
  }

  const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
    try {

      const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder)

      setOrder(incomingOrder)
      refreshCart()

    } catch (error) {

      setErrorMessage(error.data.error.message)
    
    }
  }

  return (
    <div>
      
      <Router>
          <Navigation cart={cart} />
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/shopping' element={<Shopping products={products} />} />
          <Route path='/shopping/:productID' element={<Product />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/login/:loginID' element={<Login />} />
          <Route path='/cart' element={<Cart cartItems={cartItems} />} />
          <Route path='/checkout' element={<Checkout cart={cart} order={order} handleCaptureCheckout={handleCaptureCheckout} errorMessage={errorMessage} />} />
          <Route path='*' element={<>Error page</>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App