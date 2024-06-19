import { Button, Form } from "antd";
import React from "react";

function Register() {
    return (
    <div className="flex justify-center items-center h-screen">
        <Form layout="vertical" className="w-400" bg-white p-2>
        <h2 className="uppercase my-1">
                <strong>Find Vancouver Doctor</strong>
                
            </h2>
            <h2 className="uppercase my-1">
                <strong>Register</strong>
                <hr/>
            </h2>
            <Form.Item label="Name">
                <input type="text" />
            </Form.Item>
            <Form.Item label="Email">
                <input type="email" />
            </Form.Item>
            <Form.Item label="Password">
                <input type="password" />
            </Form.Item>

           <button className="contained-btn">REGISTER</button>
        </Form>
    </div>
    );

}

export default Register;