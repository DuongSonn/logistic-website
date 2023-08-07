import React from "react";
import BaseLayout from "../components/BaseLayout";
import { Row, List, Col } from "antd";

const data = [
    {
        title: "Ant Design Title 1",
    },
    {
        title: "Ant Design Title 2",
    },
    {
        title: "Ant Design Title 3",
    },
    {
        title: "Ant Design Title 4",
    },
];

const onClickUser = () => {
    console.log("Click user");
};

function Chat() {
    return (
        <BaseLayout>
            <Row gutter={24}>
                <Col span={8}>
                    <List
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={(item, index) => (
                            <List.Item onClick={onClickUser}>
                                <List.Item.Meta title={item.title} />
                            </List.Item>
                        )}
                    />
                </Col>
                <Col span={16}>
                    <List
                        itemLayout="horizontal"
                        dataSource={data}
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
