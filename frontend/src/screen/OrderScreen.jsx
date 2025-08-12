import React, { use, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDeliverOrderMutation, useGetOrderDetailsQuery, useGetPaypalClientIdQuery, usePayOrderMutation } from '../slices/orderApiSlice'
import Loader from '../components/Loader'
import { Button, Card, Col, Image, ListGroup, ListGroupItem, Row } from 'react-bootstrap'
import Message from '../components/Message'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'

const OrderScreen = () => {
    const { id: orderId } = useParams()
    const { data: order, isLoading, error, refetch } = useGetOrderDetailsQuery(orderId);
    const userInfo = useSelector(state => state.auth.userInfo);
    const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
    const [deliverOrder, { isLoading: loadingDeliver, error: errorgDeliver }] = useDeliverOrderMutation();
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
            payPalDispatch({
                type: 'setLoadingStatus',
                value: 'pending'
            });
            if(order && !order.isPaid && !window.paypal) {
                loadPayPalScript();
            }
        }
    }, [order, paypal, payPalDispatch, errorPaypal, loadingPaypal]);


    const onApproveTest = async (data, actions) => {
        await payOrder({ orderId, details: { payer: {} } }).unwrap();
        refetch();
        toast.success('Order paid successfully');
    };

    const createOrder = async (data, actions) => {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: order.totalPrice.toFixed(2)
                }
            }]
        }).then((orderId) => {
            return orderId; 
        });
    };

    const onApprove = async (data, actions) => {
        return actions.order.capture().then(async (details) => {
            try {
                await payOrder({ orderId, details }).unwrap();
                refetch();
                toast.success('Order paid successfully');
            } catch (err) {
                console.error(err?.data?.messge || err?.message || 'Failed to pay order');
                toast.error('Failed to pay order');
            }
        });
    };

    const onError = async (err) => {
        console.error(err?.data?.messge || err?.message || 'Failed to pay order');
        toast.error('Failed to pay order');
    };

    const handleDeliveredOrder = async () => {
        try {
            const response = await deliverOrder(orderId).unwrap();
            refetch();
            toast.success('Order delivered');
        } catch (error) {
            toast.error('Deliver status can\'t updated');  
        }
    }

    if (isLoading) return <Loader />
    if (error) return <div>Error loading order details</div>
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
                                <Message variant='success'>Delivered on {order.deiiveredAt.substring(0, 19)}</Message>
                            ) : (
                                <Message variant='danger'>Not Delivered</Message>
                            )}
                        </ListGroupItem>
                        <ListGroupItem className='bg-light'>
                            <h2>Payment Method</h2>
                            <p><strong>Method:</strong> {order.paymentMethod}</p>
                            {order.isPaid ? <Message variant='success'>Paid on {order.paidAt.substring(0, 19)}</Message> : <Message variant='danger'>Not Paid</Message>}
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
                            {
                                !order.isPaid && (
                                    <ListGroupItem className='p-3'>
                                        {loadingPay && <Loader />}
                                        {isPending ? <Loader /> : (
                                            <div>
                                                <div className=' mb-3 pb-3 border-bottom'>
                                                    <Button type='button' className='btn btn-block w-100' onClick={onApproveTest} disabled={order.isPaid}>
                                                        {order.isPaid ? 'Paid' : 'Pay Now'}
                                                    </Button>
                                                </div>
                                                <PayPalButtons
                                                    createOrder={createOrder}
                                                    onApprove={onApprove}
                                                    onError={onError}
                                                />
                                            </div>
                                        )}
                                    </ListGroupItem>
                                )
                            }

                            {
                                !!userInfo?.isAdmin && !order?.isDelivered && (
                                    loadingDeliver ? <Loader /> : <ListGroupItem className='p-3'>
                                        <Button variant='info' className='w-100 text-white' onClick={handleDeliveredOrder}>Mark as delivered</Button>
                                    </ListGroupItem>
                                ) 
                            }
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default OrderScreen