import React, {useState, useEffect} from 'react';
import {Spinner, Table } from 'react-bootstrap';
import './Order.css';
import DatePicker from 'react-date-picker';

function Order(props) {
  let [config, setConfig] = useState({
    date: new Date(),
    content: (<Spinner animation="border" />)
  });
  const handleChange = (e) => {
    if (e) {
      setConfig({...config, date: e});
    }
  }
  useEffect(() => {
    props.getOrders(config.date).then((data) => {
      let content;
      if (data.length) {
        let total = data.map((item) => {
          return parseInt(item.Total, 10);
        }).reduce((total, num) => {
          return total + num;
        });
        content = (<div className="content">
          <OrderDetail data={data} total={total} products={props.products} />
        </div>);
      } else {
        content = (<div className="content">
          <span className="message">No orders found</span>
        </div>);
      }
      setConfig({...config, content: content})
    });
  }, [config.date])
  return (
    <div className="order">
            <div className="wrapper">
                <h6>Orders</h6>
                <span className="header-ctrl"><DatePicker id="example-datepicker" value={config.date} onChange={handleChange} /></span>
                {config.content}
            </div>
        </div>
  );
}
const OrderDetail = (props) => {
    let data = props.data;
    const getProductName = (id) => {
        let name = '';
        let products = props.products;
        let len = products.length;
        let i;
        for (i = 0; i < len; i++) {
          let item = products[i];
          if (item.Id == id) {
            name = item.Name;
            break;
          }
        }
        return name;
    }
    return (
      <>
      <div>Order #: {data[0]['OrderId']}</div>
      <Table size="sm" striped bordered hover >
        <thead>
          <tr>
            <th>#</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            return (
              <tr>
                <td>{index + 1}</td>
                <td>{getProductName(item.ProductId)}</td>
                <td>{item.Quantity}</td>
                <td>{item.Total}</td>
              </tr>
            )
          })}
          <tr>
            <td colspan="2"> </td>
            <td>Total</td>
            <td>{props.total}</td>
          </tr>
        </tbody>
      </Table>
    </>
    )
}
export default Order;
