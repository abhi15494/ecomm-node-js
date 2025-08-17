import React from 'react'
import { Pagination } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Paginate = ({ pages, page, isAdmin=false, keyword='' }) => {
    if(!pages || pages <= 1) {
        return <></>
    }
    return (
        <Pagination>
            {[...Array(pages).keys()].map((x) => (
                <Pagination.Item 
                    as={Link} 
                    active={x+1 === page} 
                    key={'KEY_FOR_PAGINATION' + (x+1)} 
                    to={(isAdmin ? `/admin/productList/page/${x+1}` : `/page/${x+1}`) + (keyword ? `/search/${keyword}` : '')}
                >
                    {x+1}
                </Pagination.Item>
            ))}
        </Pagination>
    )
}

export default Paginate