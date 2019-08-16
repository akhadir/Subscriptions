import React, {useState} from 'react';
import { Form} from 'react-bootstrap';

export default function (props) {
    let [formData, setSubscription] = useState(props.subscriptionData);
    let products = props.products;

    const frequencyChange = (e) => {
        let data = props.subscriptionData;
        data['Details'] = [];
        data['Type'] = e.target.value;
        setSubscription({...data});
    }
    const productChange = (e) => {
        let data = props.subscriptionData;
        data['ProductId'] = e.target.value;
        setSubscription({...data});
    }
    const changeQuantity = (e) => {
        let data = props.subscriptionData;
        data['Quantity'] = e.target.value;
        setSubscription({...data});
    }
    const changeDetails = (checked, val) => {
        let Details = formData.Details;
        let index = Details.indexOf(val);
        if (checked && index === -1) {
            Details.push(val);
        } else if (!checked && index > -1) {
            Details.splice(index, 1);
        }
        let data = props.subscriptionData;
        data['Details'] = Details;
        setSubscription({...data});
    }
    function getDaysChecked(day) {
        let details = formData.Details;
        if (Array.isArray(details) && details.indexOf(day) > -1) {
            return "checked";
        } else {
            return "";
        }
    }
    if (products.length === 1 && !formData.ProductId) {
        props.subscriptionData['ProductId'] = formData.ProductId = products[0]['Id'];
    }
    return (<Form>
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
    </Form>);
}