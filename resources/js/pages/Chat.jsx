import React, { useState, useEffect } from "react";
import BaseLayout from "../components/BaseLayout";
import { Row, List, Col } from "antd";
import { get, post } from "../utils/request";
import { getLocalStorageItem } from "../utils/auth";

const onClickUser = (data) => {
    console.log(data);
};

function Chat() {
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);

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
                        style={{ maxHeight: "200px", overflow: "auto" }}
                        renderItem={(item, index) => (
                            <List.Item>
                                <List.Item.Meta
                                    title={
                                        <a href="https://ant.design">
                                            {item.title}
                                        </a>
                                    }
                                    description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                                />
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>
        </BaseLayout>
    );
}

export default Chat;
