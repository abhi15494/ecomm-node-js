import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetUserDetailsByIdQuery, useUpdateUserMutation } from '../../slices/userApiSlice';
import { Form, Button, FormGroup, FormLabel, FormControl, FormCheck } from 'react-bootstrap';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';

const UserEditScreen = () => {
    const { id: userId } = useParams();
    const navigate = useNavigate();
    const [udata, setudata] = useState({
        name: '',
        email: '',
        isAdmin: '',
        password: ''
    });
    const { data: user, isLoading: userLoading, error: userError, refetch } = useGetUserDetailsByIdQuery(userId);
    const [updateUser, { isLoading: updateLoading, error: updateError }] = useUpdateUserMutation();

    useEffect(() => {
        if (user && !userLoading) {
            setudata({
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
            })
        }
    }, [user]);

    const goback = () => {
        navigate('/admin/userlist');
    }

    const updateUserHandler = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                _id: userId,
                ...udata
            }
            const response = await updateUser(payload).unwrap();
            toast.success('User updated');
            goback();
        } catch (error) {
            console.log(error);
            toast.error(error?.data?.message || error?.error);
        }
    }

    return (
        <>
            <Button onClick={goback}>Back</Button>
            <h1>Update user: {user?._id}</h1>
            <FormContainer>
                <Form onSubmit={updateUserHandler}>
                    <FormGroup className="mb-3">
                        <FormLabel>Name</FormLabel>
                        <FormControl
                            type="text"
                            value={udata.name}
                            onChange={(e) => setudata({ ...udata, name: e.target.value })}
                            placeholder="Enter user name"
                        />
                    </FormGroup>
                    <FormGroup className="mb-3">
                        <FormLabel>Email</FormLabel>
                        <FormControl
                            type="text"
                            value={udata.email}
                            onChange={(e) => setudata({ ...udata, email: e.target.value })}
                            placeholder="Enter email"
                        />
                    </FormGroup>
                    <FormGroup className="mb-3">
                        <FormLabel>Password</FormLabel>
                        <FormControl
                            type="text"
                            value={udata.password}
                            onChange={(e) => setudata({ ...udata, password: e.target.value })}
                            placeholder="Enter password"
                        />
                    </FormGroup>
                    <FormGroup className="mb-3">
                        <FormCheck
                            label="Is Admin?"
                            checked={udata.isAdmin}
                            onChange={(e, checked) => setudata({ ...udata, isAdmin: e.target.checked })}
                            placeholder="Enter password"
                        />
                    </FormGroup>
                    <Button type="submit" className='w-100'>Update</Button>
                </Form>
            </FormContainer>
        </>
    )
}

export default UserEditScreen