import React, { useState } from 'react'
import { Button, Form, FormControl } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom'

const SearchBox = ({ }) => {
    const { keyword: urlKeyword } = useParams();
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState(urlKeyword);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if(keyword.trim()) {
            setKeyword('');
            navigate(`/search/${keyword}`);
        } else {
            navigate('/');
        }
    };
    
    return (
        <Form onSubmit={handleSubmit} className='d-flex'>
            <FormControl 
                type='text' 
                name="q" 
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                placeholder='Search products...'
                className='mr-sm-2 ml-sm-5'
                size='sm'
            ></FormControl>
            <Button type="submit" variant='outline-success bg-white btn-sm' className='px-2 mx-2'><FaSearch /></Button>
        </Form>
    )
}

export default SearchBox