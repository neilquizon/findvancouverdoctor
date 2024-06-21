import { Button, Form, message } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { CreateUser } from "../../apicalls/users";

function Register() {

    const onFinish = async (values) => {
        try {
            const response = await CreateUser(values);
            if (response.success) {
                message.success(response.message);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            message.error(error.message);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <Form layout="vertical" className="w-400 bg-white p-2" onFinish={onFinish}>
                <h2 className="uppercase my-1">
                    <strong>Find a Vancouver Doctor</strong>

                </h2>
                <h2 className="uppercase my-1">
                    <strong>Register</strong>
                    <hr />
                </h2>
                <Form.Item label="Name" name="name">
                    <input type="text" />
                </Form.Item>
                <Form.Item label="Email" name="email">
                    <input type="email" />
                </Form.Item>
                <Form.Item label="Password" name="password">
                    <input type="password" />
                </Form.Item>

                <button className="contained-btn my-1" type="submit">REGISTER</button>
                <Link className="underline" to='/login'>Already have an account? <strong>Sign in</strong></Link>



            </Form>
        </div>
    );

}

export default Register;