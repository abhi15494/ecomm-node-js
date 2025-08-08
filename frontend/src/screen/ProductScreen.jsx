import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Button, Card, Col, Container, FormControl, Image, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import { useGetProductByIdQuery } from '../slices/productApiSlice';
import Message from '../components/Message';
import { addToCart } from '../slices/cartSlice';
import { useDispatch } from 'react-redux';

const ProductScreen = () => {
    const { id: productId } = useParams();
    const [qty, setQty] = useState(0);
    const { data: product, isLoading, error  } = useGetProductByIdQuery(productId);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const addToCartHandler = () => {
        dispatch(addToCart({
            ...product,
            qty
        }));
        navigate('/cart');
    };

    return (
        <>
            <Link to={'/'} className="btn btn-light my-3"><FaArrowLeft /> Go Back</Link>
            <br />
            {
                isLoading ? <Loader /> : error ? <Message variant={'danger'}>{error?.data?.message || error?.error}</Message> : (
                    <Row>
                        <Col sm={12} lg={5}>
                            <Image src={product?.image} alt={product?.name} fluid />
                        </Col>
                        <Col sm={12} lg={4}>
                            <ListGroup variant='flush'>
                                <ListGroupItem>
                                    <h3>{product?.name}</h3>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <Rating value={product?.rating} text={`${product?.numReviews} reviews`} />
                                </ListGroupItem>
                                <ListGroupItem>
                                    Description: {product?.description}
                                </ListGroupItem>
                            </ListGroup>
                        </Col>
                        <Col sm={12} lg={3}>
                            <Card>
                            <ListGroup variant='flush'>
                                <ListGroupItem>
                                    <Row>
                                        <Col>Price:</Col>
                                        <Col>{product?.price}</Col>
                                    </Row>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <Row>
                                        <Col>Status:</Col>
                                        <Col>{product?.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</Col>
                                    </Row>
                                </ListGroupItem>

                                {product.countInStock > 0 && (
                                    <ListGroupItem>
                                        <Row>
                                            <Col>Qty</Col>
                                            <Col>
                                                <FormControl as="select" value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                                                    {[...Array(product.countInStock).keys()].map((option) => {
                                                        return <option key={"OPTION_VALUE_" + option} value={option+1}>{option+1}</option>
                                                    })}
                                                </FormControl>
                                            </Col>
                                        </Row>
                                    </ListGroupItem>
                                )}
                                <ListGroupItem>
                                    <Button className='btn-block w-100' disabled={product?.countInStock <= 0} variant='primary' onClick={addToCartHandler}>Add to cart</Button>
                                </ListGroupItem>
                            
                            </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                )
            }
        </>
    )
}

export default ProductScreen