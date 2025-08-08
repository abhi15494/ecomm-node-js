import React from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Rating from './Rating'

const Product = ({ product }) => {
  return (
    <div className='my-2'>
        <Card className='p-2 rounded h-100 rounded shadow'>
            <Link to={'/product/' + product._id}>
                <Card.Img className='rounded border' src={product.image} variant='top' />
            </Link>
            <Card.Body>
                <Link to={'/product/' + product._id}>
                    <Card.Title as={'div'} className='product-title'>
                        <strong>{product.name}</strong>
                    </Card.Title>
                </Link>
                <Card.Text as='div'>
                    <Rating text={`${product.numReviews} reviews`} value={product.rating} />
                </Card.Text>
                <Card.Text as='h3'>
                    ${product.price}
                </Card.Text>
            </Card.Body>
        </Card>
    </div>
  )
}

export default Product