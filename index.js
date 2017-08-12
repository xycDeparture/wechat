import React from 'react'
import ReactDOM from 'react-dom'
import { Router, hashHistory } from 'react-router'
import { Provider } from 'react-redux'
import * as reducers from './reducers'
import configureStore from 'Application/utils/configure-store'
import configureRoutes from 'Application/utils/configure-routes'
import routes from './routes'
const store = configureStore(reducers)
const finallyRoutes = configureRoutes(store, routes)
document.title = '微信 - AirChat'
ReactDOM.render(
    <Provider store={store}>
        <Router
            routes={finallyRoutes} 
            history={hashHistory}
        />
    </Provider>,
    document.getElementById('app')
)