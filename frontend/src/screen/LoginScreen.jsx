import React, { useEffect, useState } from 'react'
import FormContainer from '../components/FormContainer';
import { Button, Col, Form, FormControl, FormGroup, FormLabel, Row, Toast } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import { useLoginMutation } from '../slices/userApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';

const LoginScreen = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const searchParams = new URLSearchParams(location.search);
    const redirect = searchParams.get('redirect');
    
    const [login, { isLoading, error }] = useLoginMutation();

    // const loginState = dispatch();
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if(userInfo && redirect) {
            navigate(redirect);
        }
    }, [redirect, userInfo, navigate]);

    const submitHandler = async (e) => {
        e?.preventDefault();

        try {
            // Call the login mutation
            const { email, password } = formData;
            const res = await login({ email, password }).unwrap();
            dispatch(setCredentials({ ...res }));
            navigate(redirect || '/');
        } catch (error) {
            console.log(error);
            toast.error(error.data?.message || error.error || error.message);
        }
    }

    return (
        <FormContainer>
            <h1>Sign In</h1>
            <Form onSubmit={submitHandler}>
                <FormGroup controlId='email' className='my-3'>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl 
                        type="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={e => setFormData(p => ({...p, email: e.target.value}))}
                    />
                </FormGroup>
                <FormGroup controlId='password' className='my-3'>
                    <FormLabel>Password</FormLabel>
                    <FormControl 
                        type="password"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={e => setFormData(p => ({...p, password: e.target.value}))}
                    />
                </FormGroup>
                <Button type="submit" className='w-100 mt-2' variant='primary' disabled={!(formData.email && formData.password) || isLoading}>Submit</Button>
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

export default LoginScreen