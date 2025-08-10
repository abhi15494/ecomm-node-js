import React, { use, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useGetOrderDetailsQuery, useGetPaypalClientIdQuery, usePayOrderMutation } from '../slices/orderApiSlice'
import Loader from '../components/Loader'
import { Button, Card, Col, Image, ListGroup, ListGroupItem, Row } from 'react-bootstrap'
import Message from '../components/Message'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { toast } from 'react-toastify'

const OrderScreen = () => {
    const { id: orderId } = useParams()
    const { data: order, isLoading, error } = useGetOrderDetailsQuery(orderId);

    const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
    const [{ isPending }, payPalDispatch] = usePayPalScriptReducer();
    const { data: paypal, isLoading: loadingPaypal, error: errorPaypal } = useGetPaypalClientIdQuery();

    useEffect(() => {
        if(!errorPaypal && !loadingPaypal && paypal?.clientId) {
            const loadPayPalScript = async () => payPalDispatch({
                type: 'resetOptions',
                value: {
                    'client-id': paypal.clientId,
                    currency: 'USD'
                }
            });
            console.log(loadPayPalScript)
        }
    }, [order, paypal]);

    if (isLoading) return <Loader />
    if (error) return <div>Error loading order details</div>
    


    console.log(paypal);
    console.log(order);

    return (
        <>
            <h1>Order: {order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush' className='rounded-3'>
                        <ListGroupItem className='bg-light'>
                            <h2>Shipping</h2>
                            <p><strong>Name:</strong> {order.user.name}</p>
                            <p><strong>Email:</strong> {order.user.email}</p>
                            <p>
                                <strong>Address:</strong>
                                {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                            </p>
                            {order.isDelivered ? (
                                <Message variant='success'>Delivered on {order.deliveredAt}</Message>
                            ) : (
                                <Message variant='danger'>Not Delivered</Message>
                            )}
                        </ListGroupItem>
                        <ListGroupItem className='bg-light'>
                            <h2>Payment Method</h2>
                            <p><strong>Method:</strong> {order.paymentMethod}</p>
                            {order.isPaid ? <Message variant='success'>Paid on {order.paidAt}</Message> : <Message variant='danger'>Not Paid</Message>}
                        </ListGroupItem>
                        <ListGroupItem className='bg-light'>
                            <h2>Order Items</h2>
                            <ListGroup variant='flush'>
                                {order.orderItems.length === 0 ? (
                                    <Message>Your order is empty</Message>
                                ) : (
                                    order.orderItems.map((item) => (
                                        <ListGroupItem key={item._id}>
                                            <Row>
                                                <Col md={2}>
                                                    <Image src={item.image} alt={item.name} fluid rounded />
                                                </Col>
                                                <Col>
                                                    {item.name}
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} x ${item.price} = ${Math.round(item.qty * item.price * 100) / 100}
                                                </Col>
                                            </Row>
                                        </ListGroupItem>
                                    ))
                                )}
                            </ListGroup>
                        </ListGroupItem>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card className='mb-3'>
                        <ListGroup variant='flush'>
                            <ListGroupItem className='p-3'>
                                <h2>Order Summary</h2>
                            </ListGroupItem>
                            <ListGroupItem className='p-3'>
                                <Row>
                                    <Col>Items:</Col>
                                    <Col>${order.itemsPrice}</Col>
                                </Row>
                                <Row>
                                    <Col>Shipping:</Col>
                                    <Col>${order.shippingPrice}</Col>
                                </Row>
                                <Row>
                                    <Col>Tax:</Col>
                                    <Col>${order.taxPrice}</Col>
                                </Row>
                                <Row>
                                    <Col>Total:</Col>
                                    <Col>${order.totalPrice}</Col>
                                </Row>
                            </ListGroupItem>
                            {/* PAYORDER PLACEHOLDER  */}
                            {/* MARK AS DELIVERED PLACEHOLDER */}
                            <ListGroupItem className='p-3'>
                                <Button type='button' className='btn btn-block w-100' disabled={order.isPaid}>
                                    {order.isPaid ? 'Paid' : 'Pay Now'}
                                </Button>
                            </ListGroupItem>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default OrderScreen