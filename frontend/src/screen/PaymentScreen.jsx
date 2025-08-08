import React, { useEffect, useState } from 'react'
import CheckoutSteps from '../components/CheckoutSteps'
import { Button, Container, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { savePaymentMethod } from '../slices/cartSlice'
import FormContainer from '../components/FormContainer'
import { useNavigate } from 'react-router-dom'

const PaymentScreen = () => {
  const [method, setMethod] = useState('PayPal');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Retrieve the current payment method from the Redux store
  const cart = useSelector(state => state.cart);
  const { paymentMethod, shippingAddress } = cart;

  useEffect(() => {
    if(shippingAddress === undefined || shippingAddress === null || Object.keys(shippingAddress).length === 0) {
      navigate('/shipping');
    }
    if (paymentMethod) {
      setMethod(paymentMethod);
    }
  }, [paymentMethod]);

  const handlePaymentMethodChange = (e) => {
    // dispatch(savePaymentMethod(e.target.value));
    setMethod(e.target.value);
  }

  const handlePaymentMethodSubmit = () => {
    dispatch(savePaymentMethod(method));
    navigate('/placeorder');
  }

  return (
    <>
      <CheckoutSteps step1 step2 step3 />
      <FormContainer>
        <h2>Payment Method</h2>
        <Form>
          <Form.Group controlId='paymentMethod'>
            <Form.Label as='legend'>Select Method</Form.Label>
            <Form.Check
              type='radio'
              label='PayPal or Credit Card'
              id='PayPal'
              value='PayPal'
              name='paymentMethod'
              onChange={handlePaymentMethodChange}
              checked={method === 'PayPal'}
            />
          </Form.Group>
          <Form.Group controlId='paymentMethod'>
            <Form.Check
              type='radio'
              label='Stripe'
              id='Stripe'
              value='Stripe'
              name='paymentMethod'
              onChange={handlePaymentMethodChange}
              checked={method === 'Stripe'}
            />
          </Form.Group>
          <Form.Group controlId='paymentMethod'>
            <Form.Check
              type='radio'
              label='Cash'
              id='Cash'
              value='Cash'
              name='paymentMethod'
              onChange={handlePaymentMethodChange}
              checked={method === 'Cash'}
            />
          </Form.Group>

          <Button
            type='button'
            variant='primary'
            className='mt-3'
            onClick={handlePaymentMethodSubmit}
          >
            Continue
          </Button>
        </Form>

      </FormContainer>
    </>
  )
}

export default PaymentScreen