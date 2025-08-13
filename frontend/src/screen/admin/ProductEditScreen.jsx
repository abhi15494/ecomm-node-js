import React, { useEffect, useState } from 'react'
import { useGetProductByIdQuery, useUpdateProductMutation } from '../../slices/productApiSlice'
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import FormContainer from '../../components/FormContainer';
import { Button, Form, FormControl, FormGroup, FormLabel } from 'react-bootstrap';

const ProductEditScreen = () => {
  const [pdata, setpData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    brand: '',
    category: '',
    countInStock: '',
  });
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const [updateProduct, { isLoading: loadingUpdate, error: errorUpdate }] = useUpdateProductMutation();
  const { data: product, isLoading: loadingProduct, isError: errorProduct } = useGetProductByIdQuery(productId);

  useEffect(() => {
    if (product) {
      setpData(p => ({
        ...p,
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image,
        brand: product.brand,
        category: product.category,
        countInStock: product.countInStock,
      }));
    }
  }, product);

  const updateProductHandler = async (e) => {
    e.preventDefault();
    const updatedProduct = {
      productId,
      ...pdata
    };
    const response = await updateProduct(updatedProduct).unwrap();1232
    console.log(response);
    try {
      if(response.error) {
        toast('Product udpated');
        navigate('/admin/productList');
      } else {
        toast.error('Product not updated');
      }
    } catch (error) {
      toast.error('Product not updated');
    }
  }

  return (
    <>
      <h1>Update Product: {product._id}</h1>
      <FormContainer>
        <Form onSubmit={updateProductHandler}>
          <FormGroup className="mb-3">
            <FormLabel>Name</FormLabel>
            <FormControl
              type="text"
              value={pdata.name}
              onChange={(e) => setpData({ ...pdata, name: e.target.value })}
              placeholder="Enter product name"
            />
          </FormGroup>
          <FormGroup className="mb-3">
            <FormLabel>Price</FormLabel>
            <FormControl
              type="number"
              value={pdata.price}
              onChange={(e) => setpData({ ...pdata, price: e.target.value })}
              placeholder="Enter price"
            />
          </FormGroup>
          <FormGroup className="mb-3">
            <FormLabel>Description</FormLabel>
            <FormControl
              as="textarea"
              rows={3}
              value={pdata.description}
              onChange={(e) => setpData({ ...pdata, description: e.target.value })}
              placeholder="Enter description"
            />
          </FormGroup>
          <FormGroup className="mb-3">
            <FormLabel>Image</FormLabel>
            <FormControl
              type="text"
              value={pdata.image}
              onChange={(e) => setpData({ ...pdata, image: e.target.value })}
              placeholder="Enter image URL"
            />
          </FormGroup>
          <FormGroup className="mb-3">
            <FormLabel>Brand</FormLabel>
            <FormControl
              type="text"
              value={pdata.brand}
              onChange={(e) => setpData({ ...pdata, brand: e.target.value })}
              placeholder="Enter brand"
            />
          </FormGroup>
          <FormGroup className="mb-3">
            <FormLabel>Category</FormLabel>
            <FormControl
              type="text"
              value={pdata.category}
              onChange={(e) => setpData({ ...pdata, category: e.target.value })}
              placeholder="Enter category"
            />
          </FormGroup>
          <FormGroup className="mb-3">
            <FormLabel>Count In Stock</FormLabel>
            <FormControl
              type="number"
              value={pdata.countInStock}
              onChange={(e) => setpData({ ...pdata, countInStock: e.target.value })}
              placeholder="Enter stock count"
            />
          </FormGroup>
          <Button type="submit" className='w-100'>Update</Button>
        </Form>
      </FormContainer>
    </>
  )
}

export default ProductEditScreen