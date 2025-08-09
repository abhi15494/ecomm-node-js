import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';

import { toast } from 'react-toastify';
import { Button, Card, Col, Image, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import { useCreateOrderMutation } from '../slices/orderApiSlice';
import Message from '../components/Message';
import { clearCartItems } from '../slices/cartSlice';


const PlaceOrderScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartState = useSelector((state) => state.cart);
    const [createOrder, { isLoading, error }] = useCreateOrderMutation();

    useEffect(() => {
        if (!cartState.shippingAddress.address) {
            navigate('/shipping');
        } else if (!cartState.paymentMethod) {
            navigate('/payment');
        } else if (cartState.cartItems.length === 0) {
            navigate('/cart');
        }
    }, [cartState.paymentMethod, cartState.shippingAddress, cartState.cartItems, navigate]);

    const placeOrderHandler = async () => {
        try {
            const response = await createOrder({
                orderItems: cartState.cartItems,
                shippingAddress: cartState.shippingAddress,
                paymentMethod: cartState.paymentMethod,
                itemsPrice: cartState.itemsPrice,
                taxPrice: cartState.taxPrice,
                shippingPrice: cartState.shippingPrice,
                totalPrice: cartState.totalPrice
            }).unwrap();
            navigate(`/order/${response._id}`);
            dispatch(clearCartItems());
        } catch (err) {
            console.error(err);
            toast.error('Failed to place order');
        }
    };

    return (
        <>
            <CheckoutSteps step1 step2 step3 step4 />
            <Row>
                <Col md={8}>
                    <Card className='mb-3'>
                        <ListGroup variant='flush'>
                            <ListGroupItem className='p-3'>
                                <h2>Shipping</h2>
                                <p>
                                    <strong>Address:</strong> {cartState.shippingAddress.address}, {cartState.shippingAddress.city}, {cartState.shippingAddress.postalCode}, {cartState.shippingAddress.country}
                                </p>
                            </ListGroupItem>
                            <ListGroupItem className='p-3'>
                                <h2>Payment Method</h2>
                                <p>
                                    <strong>Method:</strong> {cartState.paymentMethod}
                                </p>
                            </ListGroupItem>
                            <ListGroupItem className='p-3'>
                                <h2>Order Items</h2>
                                {
                                    cartState.cartItems.length === 0 ?
                                        (<Message>Your cart is empty</Message>) :
                                        (
                                            <ListGroup variant='flush'>
                                                {cartState.cartItems.map((item) => (
                                                    <ListGroupItem key={item._id}>
                                                        <Row>
                                                            <Col md={1}>
                                                                <Image src={item.image} alt={item.name} className='img-fluid rounded' />
                                                            </Col>
                                                            <Col>
                                                                <Link to={`/product/${item._id}`}>{item.name}</Link>
                                                                <p>Price: ${item.price}</p>
                                                            </Col>
                                                            <Col md={4}>
                                                                <p>{item.qty} x {item.price} = ${item.qty * item.price}</p>

                                                            </Col>
                                                        </Row>
                                                    </ListGroupItem>
                                                ))}
                                            </ListGroup>
                                        )
                                }
                            </ListGroupItem>
                        </ListGroup>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className='mb-3'>
                        <ListGroup variant='flush'>
                            <ListGroupItem className='p-3'>
                                <h2>Order Summary</h2>
                            </ListGroupItem>
                            <ListGroupItem className='p-3'>
                                <Row>
                                    <Col>Items: </Col>
                                    <Col>${cartState.itemsPrice}</Col>
                                </Row>
                            </ListGroupItem>
                            <ListGroupItem className='p-3'>
                                <Row>
                                    <Col>Shipping price: </Col>
                                    <Col>${cartState.shippingPrice}</Col>
                                </Row>
                            </ListGroupItem>
                            <ListGroupItem className='p-3'>
                                <Row>
                                    <Col>Tax price: </Col>
                                    <Col>${cartState.taxPrice}</Col>
                                </Row>
                            </ListGroupItem>
                            <ListGroupItem className='p-3'>
                                <Row>
                                    <Col>Total Price: </Col>
                                    <Col><strong>${cartState.totalPrice}</strong></Col>
                                </Row>
                            </ListGroupItem>
                            <ListGroupItem className='p-3'>
                                {isLoading && <Loader />}
                                {error && <Message variant='danger'>{error}</Message>}
                                <Button
                                    type='button'
                                    className='w-100'
                                    onClick={placeOrderHandler}
                                    disabled={cartState.cartItems.length === 0}
                                >
                                    Place Order
                                </Button>
                            </ListGroupItem>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default PlaceOrderScreen