import React, {useState, useEffect} from 'react';
import { Spinner } from 'react-bootstrap';
import './App.css';
import Subscription from "./Subscriptions/Subscription";
import Order from "./Orders/Order";
import Login from "./Login/Login";
function App(props) {
  const getOrders = (date) => {
    let formattedDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    return props.getOrders(config.userData['Id'], formattedDate);
  }
  function showWelcomePage(data: any) {
    config.userData = data[0];
    setConfig({
    ...config, content: (<>
      <Subscription products={data[1]} saveSubscription={saveSubscription} getSubscriptions={getSubscriptions} />
      <Order getOrders={getOrders} products={data[1]} />
    </>)
    });
  }
  const getSubscriptions = () => {
    return props.getSubscriptions(config.userData['Id']);
  }
  const saveSubscription = (data) => {
    data['UserId'] = config.userData['Id'];
    return props.saveSubscription(data);
  }
  const register = (data) => {
    props.register(data).then((udata) => {
        showWelcomePage(udata);
    });
  }
  const [config, setConfig] = useState({
      content: (<Spinner animation="border" />),
      userData: undefined
  });
  useEffect(() => {
    props.getUserProductDetails().then((data) => {
        if (!data || !data[0]) {
            setConfig({...config, content: <Login register={register}/>});
        } else {
            showWelcomePage(data);
        }
      });
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <label>Amrutha Milk</label>
        {config.userData && <span className="amt">Cash: {config.userData.Amount}.0</span>}
      </header>
      <div className="body">{config.content}</div>
      <footer>
        <label>Contact: 71213XXXXXX</label>
      </footer>
    </div>
  );
}

export default App;
