import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import "bootstrap/dist/css/bootstrap.min.css";
import App from './App';
// import * as serviceWorker from './serviceWorker';
import FetchSub from "./FetchSubscription.js";

ReactDOM.render(<App getUserProductDetails={FetchSub.getUserProductDetails} 
    saveSubscription={FetchSub.saveSubscription} getOrders={FetchSub.getOrders}
    getSubscriptions={FetchSub.getSubscriptions} register={FetchSub.register} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
