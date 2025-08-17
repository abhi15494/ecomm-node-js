import React from 'react'
import { Button, Col, Row } from 'react-bootstrap';
import Product from '../components/Product';
import { useGetProductsQuery } from '../slices/productApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useNavigate, useParams } from 'react-router-dom';
import Paginate from '../components/Paginate';
import { useSelector } from 'react-redux';

const HomeScreen = () => {
    const { pageNumber, keyword } = useParams();
    const { data, isLoading, error } = useGetProductsQuery({pageNumber, keyword});
    const {
        products,
        page,
        pages
    } = data || {};
    const {userInfo} = useSelector(state => state.auth);
    const navigate = useNavigate();
    return (
        <>
            <Row>
                {keyword && <Col md={'auto'}><Button onClick={e => navigate('/')}>Go Back</Button></Col>}
                <Col md={9}>
                    <h1>Latest Products</h1>
                </Col>
            </Row>
            {
                isLoading ? <Loader /> : error ? <Message variant={'danger'}>{error?.data?.message || error?.error}</Message> : (
                    <Row>
                        {
                            products?.map((product) => {
                                return <Col key={product._id} sm={12} md={6} lg={4} xl={3} className='px-2'>
                                    <Product product={product} />
                                </Col>
                            })
                        }
                        <Col sm={12} md={12} lg={12}>
                            <Paginate pages={pages} page={page} isAdmin={userInfo.isAdmin} keyword={keyword} />
                        </Col>
                    </Row>
                ) 
            }
        </>
    )
}

export default HomeScreen