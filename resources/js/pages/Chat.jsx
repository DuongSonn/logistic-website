import React, { useState, useEffect } from "react";
import BaseLayout from "../components/BaseLayout";
import { Row, List, Col, Form, Button, Input, message } from "antd";
import { get, post } from "../utils/request";
import { getLocalStorageItem } from "../utils/auth";

function Chat() {
    const [users, setUsers] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState({});
    const [form] = Form.useForm();

    const user = JSON.parse(getLocalStorageItem("user"));

    useEffect(() => {
        get(
            "/users/list",
            {},
            {
                Authorization: `bearer ${user.access_token}`,
            }
        )
            .then((response) => {
                const data = response.data.data;
                setUsers(data);
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
    }, []);

    useEffect(() => {
        Pusher.logToConsole = true;

        const pusher = new Pusher("6c674ea590e0817e5b80", {
            cluster: "ap1",
        });

        const channel = pusher.subscribe(`chats_${user.user_id}`);
        channel.bind("new_message", function (data) {
            if (data.sender_id === selectedUser.id) {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        sender: data.sender,
                        message: data.message.message,
                    },
                ]);
            }
        });
    }, []);

    const onClickUser = (data) => {
        const receiverId = data.id;
        setSelectedUser(data);

        get(
            "/messages/list",
            {
                receiver_id: receiverId,
            },
            {
                Authorization: `bearer ${user.access_token}`,
            }
        )
            .then((response) => {
                const data = response.data.data;
                setMessages(data);
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

    const onSubmit = (values) => {
        post(
            "/messages/create",
            {
                message: values.message,
                receiver_id: selectedUser.id,
            },
            {
                Authorization: `bearer ${user.access_token}`,
            }
        )
            .then((response) => {
                setMessages([
                    ...messages,
                    {
                        sender: user,
                        message: values.message,
                    },
                ]);

                form.resetFields();
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
        <BaseLayout>
            <Row gutter={24}>
                <Col span={8}>
                    <List
                        itemLayout="horizontal"
                        dataSource={users}
                        renderItem={(item, index) => (
                            <List.Item onClick={() => onClickUser(item)}>
                                <List.Item.Meta title={item.name} />
                            </List.Item>
                        )}
                    />
                </Col>
                <Col span={16}>
                    <List
                        itemLayout="horizontal"
                        dataSource={messages}
                        style={{ maxHeight: "500px", overflow: "auto" }}
                        renderItem={(item, index) => (
                            <List.Item>
                                <List.Item.Meta
                                    description={`${item.sender.name} : ${item.message}`}
                                />
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>
            <Row gutter={24}>
                <Form
                    form={form}
                    name="horizontal_login"
                    layout="inline"
                    onFinish={onSubmit}
                    style={{
                        position:
                            "absolute" /* Position the item absolutely within the container */,
                        bottom: 0 /* Distance from the bottom of the container */,
                        padding: "20px",
                        minWidth: "500px",
                    }}
                >
                    <Form.Item
                        name="message"
                        rules={[
                            {
                                required: true,
                                message: "Please enter your message",
                            },
                        ]}
                        style={{
                            minWidth: "400px",
                        }}
                    >
                        <Input placeholder="Your message" />
                    </Form.Item>
                    <Form.Item shouldUpdate>
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={Object.keys(selectedUser).length === 0}
                        >
                            Send
                        </Button>
                    </Form.Item>
                </Form>
            </Row>
        </BaseLayout>
    );
}

export default Chat;
