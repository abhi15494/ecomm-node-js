import React, { useEffect, useState } from 'react'
import { Badge, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom';
import { FaEarlybirds, FaShoppingBasket } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useLogoutMutation } from '../slices/userApiSlice';
import { logout } from '../slices/authSlice';

const Header = () => {
    const cartItems = useSelector(state => state?.cart?.cartItems);
    const userInfo = useSelector(state => state?.auth?.userInfo);
    const [ logoutApiCall ] = useLogoutMutation();
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            // Dispatch logout action here if needed
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate('/login')
        } catch (error) {
            console.error('Logout failed:', error);
        }   
    }

    return (
        <header>
            <Navbar bg='dark' variant='dark' expand="lg">
                <Container>
                    <Navbar.Brand as={Link} to="/"><FaShoppingBasket /> My Shop</Navbar.Brand>
                    <Navbar.Toggle aria-controls='basic-navbar-toggle'></Navbar.Toggle>
                    <Navbar.Collapse id="basic-navbar-toggle">
                        <Nav className='ms-auto'>
                            <Nav.Link as={Link} to="/cart"><FaShoppingCart /> Cart {
                                cartItems?.length > 0 && (
                                    <Badge pill bg="success" style={{marginLeft: '5px'}}>
                                        {cartItems?.reduce((s, i) => s + i.qty, 0)}
                                    </Badge>
                                )
                            }</Nav.Link>
                            {
                                userInfo ? <NavDropdown 
                                        title={
                                            <>
                                                <FaUser /> {userInfo?.name}
                                            </>
                                        }
                                        id="user-dropdown"
                                    >
                                    <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} onClick={handleLogout}>Logout</NavDropdown.Item>
                                </NavDropdown> : <Nav.Link as={Link} to="/login"><FaUser /> Sign In</Nav.Link>
                            }
                            {
                                userInfo && userInfo.isAdmin && (
                                    <NavDropdown title="Admin" id="admin-dropdown">
                                        <NavDropdown.Item as={Link} to="/admin/productlist">Products</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/admin/userlist">Users</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/admin/orderlist">Orders</NavDropdown.Item>
                                    </NavDropdown>
                                )
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header