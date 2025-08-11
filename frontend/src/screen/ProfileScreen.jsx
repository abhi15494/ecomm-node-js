import React, { useEffect, useState } from 'react'
import { Col, Form, Row, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { useProfileMutation } from '../slices/userApiSlice';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { setCredentials } from '../slices/authSlice';
import { useGetMyOrdersQuery } from '../slices/orderApiSlice';
import { Link } from 'react-router-dom';
import { FaTimes, FaCheck, Fa500Px } from 'react-icons/fa';
import FormContainer from '../components/FormContainer';

const ProfileScreen = () => {
    const userInfo = useSelector((state) => state?.auth?.userInfo);
    const dispatch = useDispatch();
    const [profileData, setProfileData] = useState({
        _id: userInfo?._id || '',
        name: userInfo?.name || '',
        email: userInfo?.email || '',
        password: '',
        confirmPassword: ''
    });
    const [updateProfile, { isLoading: loadingUpdateProfile, error }] = useProfileMutation();
    const { data: orders, isLoading: loadingOrder, error: orderError } = useGetMyOrdersQuery();
    const submitHandler = async (e) => {
        e.preventDefault();
        if (profileData.password !== profileData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        } else {
            try {
                const response = await updateProfile(profileData).unwrap();
                toast.success('Profile updated successfully');
                setProfileData({
                    ...profileData,
                    password: '',
                    confirmPassword: ''
                });
                debugger;
                dispatch(setCredentials(response));
            } catch (error) {
                toast.error('Failed to update profile');
            }
        }
    }

    useEffect(() => {
        if (userInfo) {
            setProfileData(p => ({
                ...p,
                _id: userInfo._id,
                name: userInfo.name,
                email: userInfo.email
            }));
        }
    }, [userInfo]);

    console.log(orders);
    return (
        <Row>
            <Col md={3} className='border-end'>
                <h2>User Profile</h2>
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter name'
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='email'>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type='email'
                            placeholder='Enter email'
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='password'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Enter password'
                            value={profileData.password}
                            onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='confirmPassword'>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Confirm password'
                            value={profileData.confirmPassword}
                            onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                        ></Form.Control>
                    </Form.Group>

                    <button type='submit' className='btn btn-primary mt-3' disabled={loadingUpdateProfile}>Update</button>
                    {
                        loadingUpdateProfile && <Loader />
                    }
                </Form>
            </Col>
            <Col md={9}>
                {loadingOrder ? <Loader /> : orderError ? <div>Error loading orders</div> :
                    <div>
                        <h2>My Orders</h2>
                        <Table striped bordered hover responsive className='table-sm'>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Date</th>
                                    <th>Total</th>
                                    <th>Paid</th>
                                    <th>Delivered</th>
                                    <th><Fa500Px /></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length > 0 ? orders.map(order => (
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td>${order.totalPrice.toFixed(2)}</td>
                                        <td>{order.isPaid ? <FaCheck style={{ fontSize: 20 }} className='text-success' /> : <FaTimes style={{ fontSize: 20 }} className='text-danger' />}</td>
                                        <td>{order.isDelivered ? <FaCheck style={{ fontSize: 20 }} className='text-success' /> : <FaTimes style={{ fontSize: 20 }} className='text-danger' />}</td>
                                        <td>
                                            <Link to={`/order/${order._id}`} className='btn btn-sm btn-light'>Details</Link>
                                        </td>
                                    </tr>
                                )): <tr><td colSpan="6" className="text-center py-5">No Orders Found</td></tr>}
                            </tbody>
                        </Table>
                    </div>
                }
            </Col>
        </Row>
    )
}

export default ProfileScreen