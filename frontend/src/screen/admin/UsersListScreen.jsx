import React from 'react'

import { useDeleteUserMutation, useGetUsersQuery } from '../../slices/userApiSlice'
import { Row, Col, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEdit, FaCheck, FaTimes, FaTrash} from 'react-icons/fa';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { toast } from 'react-toastify';

const UsersListScreen = () => {
    const { data: users, isLoading: loadingUsers, error: errorUsers, refetch } = useGetUsersQuery();
    const [deleteUser, {isLoading: loadingDelete, error: errorDelete}] = useDeleteUserMutation();

    const createUserHandler = async () => {

    }
    
    const deleteUserHandler = async (id) => {
        if(!window.confirm('Are you sure you want to delete user?')) {
            return false;
        }
        try {
            const response = await deleteUser(id).unwrap();
            refetch();
            toast.success('User successfully deleted');
        } catch (error) {
            toast.error(error.data.message);        
        }
    }
    
    return (
        <>
            <Row className='align-items-center'>
                <Col>
                    <h1>Users list</h1>
                </Col>
                <Col className="text-end">
                    <Button className='btn-sm' onClick={createUserHandler}><FaEdit /> Add User</Button>
                </Col>
            </Row>

            {loadingUsers ? <Loader /> : errorUsers ? <Message variant="danger">{'User error in listing.'}</Message> : <>
                <Table striped hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <td>ID</td>
                            <td>NAME</td>
                            <td>EMAIL</td>
                            <td>IS ADMIN</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.map((user) => (
                                <tr key={user._id}>
                                    <td className='text-left'>{user._id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.isAdmin ? <FaCheck className='text-success' /> : <FaTimes className='text-danger' />}</td>
                                    <td>
                                        <Link to={`/admin/user/${user._id}/edit`}>
                                            <Button className='btn-sm mx-2 text-white'><FaEdit /></Button>
                                        </Link>
                                        <Button variant='danger' className='btn-sm text-white' onClick={() => deleteUserHandler(user._id)}><FaTrash /></Button>
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

export default UsersListScreen