import React from 'react'
import { Helmet, } from 'react-helmet';

const Meta = ({
    title, description, keywords
}) => {
    console.log(title, description, keywords);
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
        </Helmet>
    )
}

Meta.defaultProps = {
    title: 'Welcome to Propshop',
    description: 'We sell the products here',
    keywords: ['Electronics', 'buy anything', 'Cheap electronics'].join(' ,')
}

export default Meta