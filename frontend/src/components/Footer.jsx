import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'

const Footer = () => {
    const currentYear = (new Date()).getFullYear();
  return (
    <footer className='bg-light py-4'>
        <Container>
            <Row>
                <Col className="text-center">
                    <p>Copyright @ {currentYear}</p>
                </Col>
            </Row>
        </Container>
    </footer>
  )
}

export default Footer