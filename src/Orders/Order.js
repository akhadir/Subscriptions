import React, {useState, useEffect} from 'react';
import { Spinner } from 'react-bootstrap';
import './Order.css';
import DatePicker from 'react-date-picker';
import { OrderDetail } from './OrderDetail';

function Order(props) {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let [config, setConfig] = useState({
        date: props.startDate,
        subscriptionData: null,
        content: (<Spinner animation="border" />)
    });
    props.refresh(() => {
        setConfig({...config, subscriptionData: null, content: (<Spinner animation="border" />)});
    })
    const handleChange = (e) => {
        if (e) {
            setConfig({...config, date: e});
        }
    }
    const setOrderFromSubs = () => {
        if (!config.subscriptionData) {
            props.getSubscriptions().then ((data) => {
                config.subscriptionData = data;
                setOrder(data);
            });
        } else {
            setOrder(config.subscriptionData);
        }
    }
    const setContent = () => {
      if (config.date <= (new Date())) {
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
                <span className="message">No orders found.</span>
              </div>);
          }
          setConfig({...config, content: content});
        });
      } else {
          setOrderFromSubs();
      }
    }
    useEffect(() => {
        setContent();
    }, [config.date, config.subscriptionData]);
    return (
        <div className="order">
            <div className="wrapper">
                <h6>Orders</h6>
                <span className="header-ctrl">
                    <DatePicker id="order-datepicker" clearIcon={null} value={config.date} onChange={handleChange} />
                </span>
                {config.content}
            </div>
        </div>
    );

    function setOrder(data: any) {
        let mdata = data.filter((item) => {
          let out = false;
          let date = config.date;
          if (item.PausedFrom === null || item.PausedTo === null ||
            item.PausedFrom === '0000-00-00 00:00:00' || item.PausedTo === '0000-00-00 00:00:00' ||
            date < new Date(item.PausedFrom) ||
            date > new Date(item.PausedTo)) {
            switch (item.Type) {
                case 'W':
                  let weekDay = weekDays[date.getDay()];
                  if (item.Details.indexOf(weekDay) > -1) {
                    out = true;
                  }
                  break;
                case 'M':
                  let today = date.getDate();
                  date.setDate(date.getDate() + 1);
                  let tomorrow = date.getDate();
                  if ((item.Details.indexOf('FD') > -1 && today === 1) ||
                    (item.Details.indexOf('LD') > -1 && tomorrow === 1)) {
                    out = true;
                  }
                  date.setDate(date.getDate() - 1);
                  break;
                case 'D':
                default:
                    out = true;
                    break;
              }
          }
          return out;
        });
        let content;
        if (mdata.length) {
            content = (<div className="content">
              <OrderDetail data={mdata} total={undefined} products={props.products} />
            </div>);
        }
        else {
            content = (<div className="content">
              <span className="message">No orders found.</span>
            </div>);
        }
        
        setConfig({ ...config, content: content });
    }
}
export default Order;
