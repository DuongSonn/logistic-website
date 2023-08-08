import React from "react";
import { Button, Checkbox, Form, Input, Row, message } from "antd";
import { setLocalStorageItem } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { post } from "../utils/request";

const Login = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = (values) => {
        console.log("Success:", values);
        post("/auth/login", values)
            .then((response) => {
                const data = {
                    access_token: response.data.data.access_token,
                    user_id: response.data.data.user_id,
                    role: response.data.data.role,
                };

                setLocalStorageItem("user", JSON.stringify(data));
                navigate("/");
            })
            .catch((error) => {
                if (error.response) {
                    const data = error.response.data;
                    messageApi.open({
                        type: "error",
                        content: data.message,
                    });
                }
            });
    };

    return (
        <Row
            justify="center" // Center horizontally
            align="middle" // Center vertically
            style={{ height: "100vh" }} // Set the container height to 100% of the viewport height
        >
            {contextHolder}
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
                    label="Email"
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: "Please input your email!",
                        },
                        {
                            type: "email",
                            message: "Please input correct email!",
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
