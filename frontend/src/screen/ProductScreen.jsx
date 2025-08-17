import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate, Form } from 'react-router-dom'
import { Button, Card, Col, Container, FormControl, FormGroup, FormLabel, Image, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import { useGetProductByIdQuery, useReviewProductMutation } from '../slices/productApiSlice';
import Message from '../components/Message';
import { addToCart } from '../slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const ProductScreen = () => {
    const { id: productId } = useParams();
    const [pdata, setpdata] = useState({
        qty: 0,
        rating: 0,
        comment: ''
    });
    const {data: product, isLoading, error, refetch} = useGetProductByIdQuery(productId);
    const [createReview, {isLoading: loadingReview, error: errorReview}] = useReviewProductMutation();
    const {userInfo} = useSelector(state => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const addToCartHandler = () => {
        dispatch(addToCart({
            ...product,
            qty: pdata.qty
        }));
        navigate('/cart');
    };

    const onReviewSubmitHandler = async (e) => {
        e.preventDefault();
        const {rating, comment} = pdata;
        const payload = {
            productId,
            rating,
            comment
        }
        try {
            await createReview(payload).unwrap();
            refetch();
            toast.success('Review submitted successfully.');
        } catch (error) {
            toast.error(error.data.message || error.error);
        }
    }

    return (
        <>
            <Link to={'/'} className="btn btn-light my-3"><FaArrowLeft /> Go Back</Link>
            <br />
            {
                isLoading ? <Loader /> : error ? <Message variant={'danger'}>{error?.data?.message || error?.error}</Message> : (
                    <>
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
                                                    <FormControl as="select" value={pdata.qty} onChange={(e) => setpdata(p => ({...p, qty: Number(e.target.value)}))}>
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
                        <Row className='review mt-4'>
                            <Col md={8}>
                                <h2>Reviews</h2>
                                {product.reviews.length === 0 && <Message>No Reviews</Message>}
                                <ListGroup variant='flush'>
                                    {product.reviews.map(review => (
                                        <ListGroupItem key={review._id}>
                                            <strong>{review.name}</strong>
                                            <Rating value={review.rating} />
                                            <p>{review.createdAt.substring(0, 10)}</p>
                                            <p>{review.comment}</p>
                                        </ListGroupItem>
                                    ))}
                                    <ListGroupItem>
                                        <h2>Write a Customer review</h2>
                                        {loadingReview && <Loader />}
                                        {userInfo ? (
                                            <Form onSubmit={onReviewSubmitHandler}>
                                                <FormGroup controlId={'rating'} className="my-2">
                                                    <FormLabel>Rating</FormLabel>
                                                    <FormControl as="select" value={pdata.rating} onChange={(e) => setpdata(p => ({...p, rating: e.target.value}))}>
                                                        <option value="">Select...</option>
                                                        <option value="1">1 - Poor</option>
                                                        <option value="2">2 - Fair</option>
                                                        <option value="3">3 - Good</option>
                                                        <option value="4">4 - Very Good</option>
                                                        <option value="5">5 - Excellent</option>
                                                    </FormControl>
                                                </FormGroup>
                                                <FormGroup controlId='comment' className='my-3'>
                                                    <FormLabel>Comment</FormLabel>
                                                    <FormControl as="textarea" value={pdata.comment} onChange={(e) => setpdata(p => ({...p, comment: e.target.value}))} />
                                                </FormGroup>
                                                <Button className='w-100' type="submit" disabled={loadingReview}>Submit Review</Button>
                                            </Form>
                                        ) : (<Message>Please <Link to='/login'>Sign in</Link> to write a review.</Message>)}
                                    </ListGroupItem>
                                </ListGroup>
                            </Col>
                            
                        </Row>
                    </>
                )
            }
        </>
    )
}

export default ProductScreen