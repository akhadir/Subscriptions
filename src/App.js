import React, {useState, useEffect, useCallback} from 'react';
import { Spinner } from 'react-bootstrap';
import './App.css';
import Subscription from "./Subscriptions/Subscription";
import Order from "./Orders/Order";
import Login from "./Login/Login";
function App(props) {
  let orderCallback;
  const [config, setConfig] = useState({
      topContent: (<Spinner animation="border" />),
      subscriptionContent: '',
      orderContent: '',
      orderStartDate: new Date(),
      userData: {Id: undefined},
      subscriptionData: null,
      productsData: null
  });
  const refreshOrder = (callback) => {
      orderCallback = callback;
  }
  const getOrders = (date) => {
      let formattedDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      return props.getOrders(config.userData['Id'], formattedDate);
  }
  const deleteSubscription = (id) => {
      let prom = props.deleteSubscription(id);
      prom.then(() => {
          if (orderCallback) {
              orderCallback();
          }
      })
      return prom;
  }
  function showWelcomePage() {
      let products = config.productsData;
      setConfig({
          ...config, 
          topContent: '',
          subscriptionContent: (<Subscription products={products} saveSubscription={saveSubscription} 
              deleteSubscription={deleteSubscription} getSubscriptions={getSubscriptions} />),
          orderContent: (<Order refresh={refreshOrder} startDate={config.orderStartDate} getOrders={getOrders} products={products} getSubscriptions={getSubscriptions} />)
      });
  }
  const getSubscriptions = useCallback(() => {
      if (config.userData) {
          let prom = props.getSubscriptions(config.userData['Id']);
          prom.then((sdata) => {
              config.subscriptionData = sdata;
          });
          return prom;
      }
  }, [config.userData['Id']]);
  const saveSubscription = useCallback((data) => {
      data['UserId'] = config.userData['Id'];
      let prom = props.saveSubscription(data);
      if (data['Id']) {
          config.subscriptionData = null;
          prom.then(() => {
              if (orderCallback) {
                  orderCallback();
              }
              showWelcomePage();
          });
      } else {
          prom.then(() => {
              if (orderCallback) {
                  orderCallback();
              }
          });
      }
      return prom;
  }, []);
  const register = (data) => {
      props.register(data).then((udata) => {
          config.userData = udata[0];
          config.productsData = udata[1];
          showWelcomePage();
      });
  }
  
  useEffect(() => {
    props.getUserProductDetails().then((data) => {
        if (!data || !data[0]) {
            setConfig({...config, topContent: <Login register={register}/>});
        } else {
            config.userData = data[0];
            config.productsData = data[1];
            showWelcomePage();
        }
      });
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <label>Amruth Milk</label>
        {config.userData && <span className="amt">Cash: {config.userData.Amount}.0</span>}
      </header>
      <div className="body">
        {config.topContent}
        {config.subscriptionContent}
        {config.orderContent}
      </div>
      <footer>
        <label>Contact: 71213XXXXXX</label>
      </footer>
    </div>
  );
}

export default App;
