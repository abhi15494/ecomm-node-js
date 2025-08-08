import React from 'react'
import { Card, Col, Container, Row }  from 'react-bootstrap';

const FormContainer = ({children}) => {
  return (
    <Container className='my-4'>
        <Row className='justify-content-md-center'>
            <Col xs={12} md={6}>
                <Card className='p-4'>
                    {children}
                </Card>
            </Col>
        </Row>
    </Container>
  )
}

export default FormContainer