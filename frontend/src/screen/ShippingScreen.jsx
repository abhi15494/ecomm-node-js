import React, { useEffect, useState } from 'react'
import FormContainer from '../components/FormContainer'
import { Button, Form, FormControl, FormGroup, FormLabel } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';

const ShippingScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const shippingAddress = useSelector(state => state.cart.shippingAddress); 

    const [address, setAddress] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: ''
    });

    useEffect(() => {
        if (shippingAddress) {
            setAddress(shippingAddress);
        }
    }, [shippingAddress]);

    const handleShippingSubmit = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({...address}));
        navigate('/payment');
    }
    
    return (<>
        <CheckoutSteps step1 step2 />
        <FormContainer>
            <h2>Shipping Address</h2>
            <Form onSubmit={handleShippingSubmit}>
                <FormGroup controlId='address' className='my-3'>
                    <FormLabel>Address</FormLabel>
                    <FormControl
                        type='text'
                        placeholder='Enter address'
                        required
                        value={address.address}
                        onChange={e => setAddress(p => ({ ...p, address: e.target.value }))}
                    />
                </FormGroup>
                <FormGroup controlId='city' className='my-3'>
                    <FormLabel>City</FormLabel>
                    <FormControl
                        type='text'
                        placeholder='Enter city'
                        required
                        value={address.city}
                        onChange={e => setAddress(p => ({ ...p, city: e.target.value }))}
                    />
                </FormGroup>
                <FormGroup controlId='postalCode' className='my-3'>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl
                        type='text'
                        placeholder='Enter postal code'
                        required
                        value={address.postalCode}
                        onChange={e => setAddress(p => ({ ...p, postalCode: e.target.value }))}
                    />
                </FormGroup>
                <FormGroup controlId='country' className='my-3'>
                    <FormLabel>Country</FormLabel>
                    <FormControl
                        type='text'
                        placeholder='Enter country'
                        required
                        value={address.country}
                        onChange={e => setAddress(p => ({ ...p, country: e.target.value }))}
                    />
                </FormGroup>
                <Button type='submit' variant='primary'>
                    Continue
                </Button>
            </Form>
        </FormContainer>
    </>
    )
}

export default ShippingScreen