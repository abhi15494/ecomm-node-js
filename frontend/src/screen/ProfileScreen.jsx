import React, { useEffect, useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { useProfileMutation } from '../slices/userApiSlice';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { setCredentials } from '../slices/authSlice';

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
    const [ updateProfile, { isLoading: loadingUpdateProfile, error } ] = useProfileMutation();
    const submitHandler = async (e) => {
        e.preventDefault();
        if(profileData.password !== profileData.confirmPassword) {
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
        console.log('SUBMIT CLICKED');
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
    
    console.log(profileData);
    return (
        <Row>
            <Col md={3}>
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
            </Col>
        </Row>
    )
}

export default ProfileScreen