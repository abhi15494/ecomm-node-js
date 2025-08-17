import React from 'react'
import { useGetTopProductsQuery } from '../slices/productApiSlice'
import Loader from './Loader';
import { Carousel, CarouselCaption, CarouselItem, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Product from './Product';

const ProductCarousal = () => {
    const {data:products, isLoading, error} = useGetTopProductsQuery();

    if(isLoading) {
        return <Loader />
    }

    return (
        <Carousel pause="hover" className='bg-primary mb-4 rounded'>
            {products.map(product => (
                <CarouselItem key={'CAROUSEL_ITEM_' + product._id} as={Link} to={`/product/${product._id}`}>
                    <div className='carousel-item-inner'>
                        <Image src={product.image} alt={product.name} fluid></Image>
                        <CarouselCaption className='carousel-caption'>
                            <h2>{product.name} (${product.price})</h2>
                        </CarouselCaption>
                    </div>
                </CarouselItem>
            ))}
        </Carousel>
    )
}

export default ProductCarousal