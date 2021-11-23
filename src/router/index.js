import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Home from '../views/home'
import Admin from '../views/Admin'
import Login from '../views/Login'
import Register from '../views/Register'
import ProductDetail from '../views/product-detail'
import ViewAccount from '../views/ViewAccount'
import ViewOrder from '../views/ViewOrder'
import Restore from '../views/Restore'
import Cart from '../views/Cart'
import OrderSuccessed from '../views/OrderSuccessed'
export default function index() {
    return (
        <div>
            <Router>
                <Route path='/' component={Home} exact />
                <Route path='/danhmuc/:madm' component={Home} exact />
                <Route path='/login' component={Login} exact/>
                <Route path='/admin/:pageEnpoint' component={Admin} exact/>
                <Route path='/admin/:pageEnpoint/:childEnpoint' component={Admin} exact/>
                <Route path='/register' component={Register} exact/>
                <Route path="/product/:masp" component={ProductDetail} />
                <Route path="/cart" component={Cart} />
                <Route path="/viewAccount" component={ViewAccount} />
                <Route path="/viewOrder" component={ViewOrder} />
                <Route path="/restore" component={Restore} />
                <Route path="/orderSuccessed" component={OrderSuccessed} />
            </Router>
        </div>
    )
}
