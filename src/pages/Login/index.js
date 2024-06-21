import { Button, Form } from "antd";
import React from "react";
import { Link } from "react-router-dom";

function Login() {

    const onFinish = (values) => {
        console.log(values);
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <Form layout="vertical" className="w-400 bg-white p-2" onFinish={onFinish}>
                <h2 className="uppercase my-1">
                    <strong>Find a Vancouver Doctor</strong>

                </h2>
                <h2 className="uppercase my-1">
                    <strong>Login</strong>
                    <hr />
                </h2>

                <Form.Item label="Email" name="email">
                    <input type="email" />
                </Form.Item>
                <Form.Item label="Password" name="password">
                    <input type="password" />
                </Form.Item>

                <button className="contained-btn my-1" type="submit">Login</button>
                <Link className="underline" to='/Register'>Don't have an account? <strong>Register</strong></Link>



            </Form>
        </div>
    );

}

export default Login;