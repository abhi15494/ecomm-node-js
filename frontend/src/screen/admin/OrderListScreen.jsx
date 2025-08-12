import React from 'react'
import { useGetOrdersQuery } from '../../slices/orderApiSlice'
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { Button, Table } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const OrderListScreen = () => {
    const { data: orders, isLoading, error } = useGetOrdersQuery();
    
    if(isLoading) return <Loader />
    if(error) return <Message>{error?.data?.message || error.message}</Message>
    return (
        <div>
            <h1>Orders</h1>
            <Table hover responsive className='table-sm'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>USER</th>
                        <th>DATE</th>
                        <th>TOTAL</th>
                        <th>PAID</th>
                        <th>DELIVERED</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        orders.length > 0 ? 
                        orders.map((order, index) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.user.name}</td>
                                <td>{order.createdAt.substring(0, 10)}</td>
                                <td>${order.totalPrice}</td>
                                <td>{order.isPaid ? <FaCheck className='text-success' /> : <FaTimes className='text-danger' />}</td>
                                <td>{order.isDelivered ? <FaCheck className='text-success' /> : <FaTimes className='text-danger' />}</td>
                                <td><Link to={`/order/${order._id}`}>
                                    <Button variant='light' className='btn-sm'>Details</Button>
                                </Link></td>
                            </tr>
                        )):
                        <tr>
                            <td colSpan={7} className='p-5'>NO DATA FOUND</td>
                        </tr>
                    }
                </tbody>
            </Table>
        </div>
    )
}

export default OrderListScreen