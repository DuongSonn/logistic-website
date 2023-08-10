import React, { useState, useEffect } from "react";
import BaseLayout from "../components/BaseLayout";
import { Row, Col, Form, Button, Input, message, Table, Rate } from "antd";
import { get, post } from "../utils/request";
import { getLocalStorageItem } from "../utils/auth";

function Rating() {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [reviews, setReviews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [total, setTotal] = useState(0);

    const user = JSON.parse(getLocalStorageItem("user"));

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Rating",
            dataIndex: "rating",
            key: "rating",
        },
        {
            title: "Comment",
            dataIndex: "comment",
            key: "comment",
        },
    ];

    useEffect(() => {}, []);

    const handlePaginationChange = (page, pageSize) => {
        setCurrentPage(page);
        setItemsPerPage(pageSize);
    };

    const onFinish = (values) => {
        console.log("Success:", values);
    };

    return (
        <BaseLayout>
            {user.role === "admin" ? (
                <Row gutter={24}>
                    <Col span={24}>
                        <Table
                            dataSource={reviews}
                            columns={columns}
                            pagination={false}
                        />
                        <Pagination
                            style={{
                                marginTop: "16px",
                                float: "right",
                            }}
                            current={currentPage}
                            pageSize={itemsPerPage}
                            total={total}
                            showSizeChanger
                            showTotal={(total) => `Total ${total} items`}
                            onChange={handlePaginationChange}
                        />
                    </Col>
                </Row>
            ) : (
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
                        label="Comment"
                        name="comment"
                        rules={[
                            {
                                required: true,
                                message: "Please input your comment!",
                            },
                        ]}
                    >
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item name="rating" label="Rating">
                        <Rate></Rate>
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
            )}
        </BaseLayout>
    );
}

export default Rating;
