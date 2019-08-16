import React, {useState} from 'react';
import { Form} from 'react-bootstrap';
import './Login.css';

function Login(props) {
    const [formData, setFormData] = useState({
        Name: '',
        Phone: '',
        FlatNo: '',
        Address: '',
    });
    const register = (e) => {
        e.preventDefault();
        props.register(formData);
    }
    const nameChange = (e) => {
        setFormData({...formData, Name: e.target.value});
    }
    const phoneChange = (e) => {
        setFormData({...formData, Phone: e.target.value});
    }
    const flatNoChange = (e) => {
        setFormData({...formData, FlatNo: e.target.value});
    }
    const addressChange = (e) => {
        setFormData({...formData, Address: e.target.value});
    }
    return (
    <div className="login">
        <h3>Register</h3>
        <Form>
            <Form.Group controlId="Name">
                <Form.Label>Name:</Form.Label>
                <Form.Control type="text" name="Name" onChange={nameChange} defaultValue={formData.Name}/>
            </Form.Group>
            <Form.Group controlId="Phone">
                <Form.Label>Phone:</Form.Label>
                <Form.Control type="text" name="Phone" onChange={phoneChange} defaultValue={formData.Phone}/>
            </Form.Group>
            <Form.Group controlId="FlatNo">
                <Form.Label>Door/Flat No.:</Form.Label>
                <Form.Control type="text" name="FlatNo" onChange={flatNoChange} defaultValue={formData.FlatNo}/>
            </Form.Group>
            <Form.Group controlId="Address">
                <Form.Label>Flat/House Address:</Form.Label>
                <Form.Control type="text" name="Address" onChange={addressChange} defaultValue={formData.Address}/>
            </Form.Group>
            <Form.Control type="submit" onClick={register}/>
        </Form>
    </div>
  );
}

export default Login;
