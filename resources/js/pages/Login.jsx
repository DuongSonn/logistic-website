import React from "react";
import { Button, Checkbox, Form, Input, Row } from "antd";
import { setLocalStorageItem } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const onFinish = (values) => {
        console.log("Success:", values);
        setLocalStorageItem("user", JSON.stringify(values));

        navigate("/");
    };

    return (
        <Row
            justify="center" // Center horizontally
            align="middle" // Center vertically
            style={{ height: "100vh" }} // Set the container height to 100% of the viewport height
        >
            <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                style={{
                    maxWidth: 600,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: "Please input your username!",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: "Please input your password!",
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="remember"
                    valuePropName="checked"
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Row>
    );
};

export default Login;
