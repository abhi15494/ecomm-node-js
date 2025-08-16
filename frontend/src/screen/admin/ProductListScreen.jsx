import React from 'react'
import { useCreateProductMutation, useDeleteProductMutation, useGetProductsQuery } from '../../slices/productApiSlice'
import { Button, Col, Row, Table } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProductListScreen = () => {
    const { data: products, isLoading: productLoading, error: productError, refetch } = useGetProductsQuery();
    const [createProduct, {isLoading:loadingCreate, error:loadingError}] = useCreateProductMutation();
    const [deleteProduct, {isLoading: deleteLoading, error: deleteError}] = useDeleteProductMutation();

    const deleteHandler = async (productId) => {
        if(!window.confirm('Are you sure you want to delete a product?')) {
            return false;
        }
        try {
            await deleteProduct(productId);
            refetch();
            toast.success('Product deleted.');
        } catch (err) {
            toast.error('SOMETHING WENT WRONG');
        }
    }

    const createProductHandler = async () => {
        if(!window.confirm('Are you sure you want to create product?')) {
            return false;
        }
        try {
            const response = await createProduct({}).unwrap();
            console.log(response);
            refetch();
            toast.success('Product created');
        } catch (error) {
            toast.error('Product created');
        }
    }
    
    return (
        <>
            <Row className='align-items-center'>
                <Col>
                    <h1>Products list</h1>
                </Col>
                <Col className="text-end">
                    <Button className='btn-sm' onClick={createProductHandler}><FaEdit /> Add Product</Button>
                </Col>
            </Row>

            {productLoading ? <Loader /> : productError ? <Message variant="danger">{'Product error in listing.'}</Message> : <>
                <Table striped hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <td>ID</td>
                            <td>NAME</td>
                            <td>PRICE</td>
                            <td>CATEGORY</td>
                            <td>BRANDS</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products.map((product) => (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td>${product.price}</td>
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>
                                        <Link to={`/admin/product/${product._id}/edit`}>
                                            <Button className='btn-sm mx-2 text-white'><FaEdit /></Button>
                                        </Link>
                                        <Button variant='danger' className='btn-sm text-white' onClick={() => deleteHandler(product._id)}><FaTrash /></Button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </>}
        </>
    )
}

export default ProductListScreen