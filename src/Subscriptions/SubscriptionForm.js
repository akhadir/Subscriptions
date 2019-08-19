import React, {useState, useCallback} from 'react';
import { MdPauseCircleFilled, MdDelete, MdSave } from 'react-icons/md';
import { Form, Popover, OverlayTrigger} from 'react-bootstrap';
import DatePicker from 'react-date-picker';
export default function (props) {
    let products = props.products;
    let today = new Date();
    today.setDate(today.getDate() + 1);
    let startDate = new Date(today);
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setSeconds(0);
        let endDate = new Date(today);
        endDate.setHours(23);
        endDate.setMinutes(59);
        endDate.setSeconds(59);
    const [config, setConfig] = useState({
        formData: props.subscriptionData,
        startDate: startDate,
        endDate: endDate
    });
    const frequencyChange = (e) => {
        let data = props.subscriptionData;
        data['Details'] = [];
        data['Type'] = e.target.value;
        setConfig({...config, formData: {...data}});
    }
    const productChange = (e) => {
        let data = props.subscriptionData;
        data['ProductId'] = e.target.value;
        setConfig({...config, formData: {...data}});
    }
    const changeQuantity = (e) => {
        let data = props.subscriptionData;
        data['Quantity'] = e.target.value;
        setConfig({...config, formData: {...data}});
    }
    const changeDetails = (checked, val) => {
        let Details = config.formData.Details;
        let index = Details.indexOf(val);
        if (checked && index === -1) {
            Details.push(val);
        } else if (!checked && index > -1) {
            Details.splice(index, 1);
        }
        let data = props.subscriptionData;
        data['Details'] = Details;
        setConfig({...config, formData: {...data}});
    }
    const saveSubscription = useCallback(() => {
        props.saveSubscription(config.formData);
    }, []);
    function getDaysChecked(day) {
        let details = config.formData.Details;
        if (Array.isArray(details) && details.indexOf(day) > -1) {
            return "checked";
        } else {
            return "";
        }
    }
    const startDateChange = (e) => {
        config.startDate = e;
        e.setHours(0);
        e.setMinutes(0);
        e.setSeconds(0);
        if (config.endDate < e) {
            let endDate = new Date(e);
            config.endDate = endDate;
            endDate.setHours(23);
            endDate.setMinutes(59);
            endDate.setSeconds(59);
        }
        setConfig({...config});
    }
    const endDateChange = (e) => {
        config.endDate = e;
        setConfig({...config});
    }
    const pauseSubscription = () => {
        let startDate = config.startDate;
        let endDate = config.endDate;
        return (<Popover id="popover-pause-sub" className="popover-pause-sub">
            <Popover.Title as="h3">Pause Subscription</Popover.Title>
            <Popover.Content>
                <Form>
                    <Form.Group controlId="PausedFrom">
                        <Form.Label>From:</Form.Label>
                        <div>
                            <DatePicker minDate={today} id="start-order-datepicker" clearIcon={null} value={startDate} onChange={startDateChange} />
                        </div>
                    </Form.Group>
                    <Form.Group controlId="PausedTo">
                        <Form.Label>To:</Form.Label>
                        <div>
                            <DatePicker minDate={startDate} id="end-order-datepicker" clearIcon={null} value={endDate} onChange={endDateChange} />
                        </div>
                    </Form.Group>
                    <input type="submit" value="Save" />
                </Form>
            </Popover.Content>
        </Popover>);
    }
    const deleteSubscription = () => {
        if (window.confirm("Do you want to delete?")) {
            props.deleteSubscription(config.formData.Id);
        }
    }
    let formData = config.formData;
    if (products.length === 1 && !formData.ProductId) {
        props.subscriptionData['ProductId'] = formData.ProductId = products[0]['Id'];
    }
    return (
    <div className="sub-form">
        {formData.Id && <div className="sub-ctrl">
            <MdSave onClick={saveSubscription} />
            <OverlayTrigger placement="bottom" trigger="click" overlay={pauseSubscription()}>
                <MdPauseCircleFilled />
            </OverlayTrigger>
            <MdDelete onClick={deleteSubscription} />
        </div>}
        <Form>
            <Form.Group controlId="frequency">
                <Form.Label>Product:</Form.Label>
                <select id="product-details" defaultValue={formData.ProductId} onChange={productChange}>
                    {products.map((product) => {
                        return (<option value={product.Id} key={product.Id}>{product.Name}</option>);
                    })}
                </select>
            </Form.Group>
            <Form.Group controlId="type">
                <Form.Label>Frequency:</Form.Label>
                <select id="type-details" defaultValue={formData.Type} onChange={frequencyChange}>
                    <option value={'D'}>Daily</option>
                    <option value={'W'}>Weekly</option>
                    <option value={'M'}>Monthly</option>
                </select>
            </Form.Group>
            {formData.Type === 'W' && (<Form.Group controlId="weekdays">
                <Form.Label>Weekdays:</Form.Label>
                <Form.Check type="checkbox" label="Sun" checked={getDaysChecked("Sun")} onChange={(e) => changeDetails(e.target.checked, "Sun")} />
                <Form.Check type="checkbox" label="Mon" checked={getDaysChecked("Mon")} onChange={(e) => changeDetails(e.target.checked, "Mon")} />
                <Form.Check type="checkbox" label="Tue" checked={getDaysChecked("Tue")} onChange={(e) => changeDetails(e.target.checked, "Tue")} />
                <Form.Check type="checkbox" label="Wed" checked={getDaysChecked("Wed")} onChange={(e) => changeDetails(e.target.checked, "Wed")} />
                <Form.Check type="checkbox" label="Thu" checked={getDaysChecked("Thu")} onChange={(e) => changeDetails(e.target.checked, "Thu")} />
                <Form.Check type="checkbox" label="Fri" checked={getDaysChecked("Fri")} onChange={(e) => changeDetails(e.target.checked, "Fri")} />
                <Form.Check type="checkbox" label="Sat" checked={getDaysChecked("Sat")} onChange={(e) => changeDetails(e.target.checked, "Sat")} />
            </Form.Group>)}
            {formData.Type === 'M' && (<Form.Group controlId="monthdays">
                <Form.Label>Monthdays:</Form.Label>
                <Form.Check type="checkbox" label="First Day" name="monthdays" checked={getDaysChecked("FD")} onChange={(e) => changeDetails(e.target.checked, "FD")} />
                <Form.Check type="checkbox" label="Last Day" name="monthdays" checked={getDaysChecked("LD")} onChange={(e) => changeDetails(e.target.checked, "LD")} />
            </Form.Group>)}
            <Form.Group controlId="Quantity">
                <Form.Label>Quantity:</Form.Label>
                <Form.Control type="number" onChange={changeQuantity} defaultValue={formData.Quantity} min={1} max={100}/>
            </Form.Group>
        </Form>
    </div>
    );
}