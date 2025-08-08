import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import Product from '../components/Product';
import axios from 'axios';
import { useGetProductsQuery } from '../slices/productApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

const HomeScreen = () => {
    const { data: products, isLoading, error } = useGetProductsQuery();

    return (
        <>
            <h1>Latest Products</h1>
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
                    </Row>
                ) 
            }
        </>
    )
}

export default HomeScreen