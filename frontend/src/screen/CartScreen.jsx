import React from 'react'
import { Button, Card, Col, FormControl, Image, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, Links } from 'react-router-dom'
import Message from '../components/Message';
import { FaTrash } from 'react-icons/fa';
import { addToCart, removeFromCart } from '../slices/cartSlice';

const CartScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector(state => state?.cart);
    const { cartItems } = cart;

    const addToCartHandler = async (item, qty) => {
        dispatch(addToCart({
            ...item, qty
        }));
    }

    const removeFromCartHandler = async (item) => {
        dispatch(removeFromCart(item._id))
    }

    const checkoutHandler = () => {
        navigate('/login?redirect=/shipping');
    }

    return (
        <Row>
            <Col md={8}>
                <h1 style={{marginBottom: '20px'}}>Shopping Cart</h1>
                {
                    cartItems.length === 0 ?
                    <Message> Your Cart is empty <Link to='/'>Go Back</Link></Message> :
                    (<ListGroup variant='flush' className='border rounded'>
                        {
                            cartItems.map((item) => {
                                return <ListGroupItem key={"ITEM_ID_" +item._id}>
                                    <Row className='align-items-center'>
                                        <Col md={2}>
                                            <Image src={item.image} alt={item.name} fluid rounded />
                                        </Col>
                                        <Col md={3}>
                                            <Link to={`/product/${item._id}`}>{item.name}</Link>
                                        </Col>
                                        <Col md={2}>
                                            ${item.price}
                                        </Col>
                                        <Col md={3}>
                                            <FormControl as="select" 
                                                value={item.qty} 
                                                onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                                            >
                                                {[...Array(item.countInStock).keys()].map((option) => {
                                                    return <option key={"OPTION_VALUE_" + option} value={option+1}>{option+1}</option>
                                                })}
                                            </FormControl>
                                        </Col>
                                        <Col md={2} className='d-flex justify-content-end'>
                                            <Button type='button' variant='light' onClick={() => removeFromCartHandler(item)}>
                                                <FaTrash />
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroupItem>
                            })
                        }
                    </ListGroup>)
                }
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroupItem>
                            <h2>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</h2>
                            ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                        </ListGroupItem>
                        <ListGroupItem>
                            <Button type="button" className='btn-block w-100' disabled={cartItems.length === 0} onClick={checkoutHandler}>Proceed to Checkout</Button>
                        </ListGroupItem>

                    </ListGroup>
                </Card>
            </Col>
        </Row>
    )
}

export default CartScreen