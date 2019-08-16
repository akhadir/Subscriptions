import React, {useState, useEffect} from 'react';
import { MdAddCircle } from 'react-icons/md';
import { Button, Card, Accordion, Modal, Spinner } from 'react-bootstrap';
import './Subscription.css';
import SubscriptionForm from "./SubscriptionForm";
function Subscription(props) {
    let subscriptionData = {
        ProductId: '',
        Type: 'D',
        Details: [],
        Quantity: 1
    }
    const saveSubscription = () => {
        props.saveSubscription(subscriptionData).then((data) => {
            if (data === '') {
                setConfig({
                    content: (<Spinner animation="border" />),
                    modal: ''
                });
            }
        });
    }
    const [config, setConfig] = useState({
        content: (<Spinner animation="border" />),
        modal: ''
    });
    const handleClose = () => {
        setConfig({...config, modal: ''});
    }
    const showAddScreen = () => {
        setConfig({...config, modal: (<Modal className="subs-dialog" show={true} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Add Subscription</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <SubscriptionForm products={props.products} subscriptionData={subscriptionData} />
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <Button variant="primary" onClick={saveSubscription}>Save</Button>
            </Modal.Footer>
        </Modal>)});
    }
    useEffect(() => {
        getSubscriptions();
    }, [config.modal])
    return (
        <div className="subscription">
            <div className="wrapper">
                <h6>Subscription</h6>
                <span className="header-icon" onClick={showAddScreen}><MdAddCircle /></span>
                {config.content}
            </div>
            {config.modal}
        </div>
    );
    function getProductName (id, products) {
        var name = '';
        products.forEach(element => {
            if (element['Id'] === id) {
                name = element['Name'];
                return true;
            }
        });
        return name;
    }
    function getSubscriptions() {
        props.getSubscriptions().then((data) => {
            if (data.length) {
                setConfig({
                ...config, content: (<Accordion defaultActiveKey={0}>
                    {data.map((item, index) => {
                        return (<Card key={index}>
                            <Accordion.Toggle as={Card.Header} eventKey={index}>{index + 1}. {getProductName(item.ProductId, props.products)}</Accordion.Toggle>
                            <Accordion.Collapse eventKey={index}>
                                <Card.Body>
                                    <SubscriptionForm products={props.products} subscriptionData={item} />
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>);
                    })}
                </Accordion>)
                });
            }
            else {
                config['content'] = (<div className="add-subs">
                    <Button className="add-sub-icon" onClick={showAddScreen}><MdAddCircle /> Add Subscription</Button>
                </div>);
                setConfig({ ...config });
            }
        });
    }
}

export default Subscription;
