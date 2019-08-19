import React from 'react';
import { Table } from 'react-bootstrap';
export const OrderDetail = (props) => {
  let data = props.data;
  const getProductName = (id) => {
    let name = '';
    let products = props.products;
    let len = products.length;
    let i;
    for (i = 0; i < len; i++) {
      let item = products[i];
      if (item.Id === id) {
        name = item.Name;
        break;
      }
    }
    return name;
  };
  const getProductItemTotal = (id, qty) => {
    let total = 0;
    let products = props.products;
    let len = products.length;
    let i;
    for (i = 0; i < len; i++) {
      let item = products[i];
      if (item.Id === id) {
        total = item.Amount * qty;
        break;
      }
    }
    return total;
  };
  const getProductTotal = (subscriptions) => {
    let total = 0;
    let len = subscriptions.length;
    let i;
    for (i = 0; i < len; i++) {
      let item = subscriptions[i];
      total += getProductItemTotal(item.ProductId, item.Quantity);
    }
    return total;
  };
  return (<>
    <div>Order #: {data[0]['OrderId'] ? data[0]['OrderId'] : 'Pending'}</div>
    <Table size="sm" striped bordered hover>
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
          return (<tr key={index}>
            <td>{index + 1}</td>
            <td>{getProductName(item.ProductId)}</td>
            <td>{item.Quantity}</td>
            <td>{item.Total ? item.Total : getProductItemTotal(item.ProductId, item.Quantity)}</td>
          </tr>);
        })}
        <tr>
          <td colSpan="2"> </td>
          <td>Total</td>
          <td>{props.total ? props.total : getProductTotal(data)}</td>
        </tr>
      </tbody>
    </Table>
  </>);
};
