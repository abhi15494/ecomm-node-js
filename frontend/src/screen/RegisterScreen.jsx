import React, { useEffect, useState } from 'react'
import { useRegisterMutation } from '../slices/userApiSlice';
import FormContainer from '../components/FormContainer';
import { Button, Col, Form, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { setCredentials } from '../slices/authSlice';
import { useDispatch } from 'react-redux';

const RegisterScreen = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [register, { isLoading, error }] = useRegisterMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const redirect = searchParams.get('redirect');

    useEffect(() => {
        if(redirect) {
            navigate(redirect);
        }
    }, [redirect, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await register(formData).unwrap();
            toast.success('Registration successful!');
            dispatch(setCredentials({ ...response }));
            navigate(redirect || '/');
        } catch (err) {
            toast.error(err.data?.message || err.error || err.message);
        }
    }

    return (
        <FormContainer>
            <h1>Register new user</h1>
            <Form onSubmit={submitHandler}>
                <FormGroup controlId='name' className='my-3'>
                    <FormLabel>Name *</FormLabel>
                    <FormControl 
                        type="name"
                        placeholder="Enter name"
                        value={formData.name}
                        onChange={e => setFormData(p => ({...p, name: e.target.value}))}
                    />
                </FormGroup>
                <FormGroup controlId='email' className='my-3'>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl 
                        type="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={e => setFormData(p => ({...p, email: e.target.value}))}
                    />
                </FormGroup>
                <FormGroup controlId='password' className='my-3'>
                    <FormLabel>Password *</FormLabel>
                    <FormControl 
                        type="password"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={e => setFormData(p => ({...p, password: e.target.value}))}
                    />
                </FormGroup>
                <Button type="submit" className='w-100 mt-2' variant='primary' disabled={!(formData.email && formData.password && formData.name) || isLoading}>Submit</Button>
            </Form>

            <div className='border-top w-100 mt-3'></div>
            <Row className='pt-3'>
                <Col>
                    New Customer? <Link to={redirect ? `/register?redirect=${redirect}` : `/register`}>Register</Link>
                </Col>
            </Row>

            {isLoading && <Loader />}
        </FormContainer>
    )
}

export default RegisterScreen