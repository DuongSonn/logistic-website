import React, { useState, useEffect } from "react";
import BaseLayout from "../components/BaseLayout";
import {
    Row,
    Col,
    Form,
    Button,
    Input,
    message,
    Table,
    Rate,
    Pagination,
} from "antd";
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
    const getRatings = (filter) => {
        get(
            "/reviews/list",
            {
                ...filter,
            },
            {
                Authorization: `bearer ${user.access_token}`,
            }
        )
            .then((response) => {
                const data = response.data.data;
                const { reviews, count } = data;

                const reviewsData = [];
                for (const item of reviews) {
                    const { users, comment, rating, id } = item;
                    reviewsData.push({
                        key: id,
                        comment,
                        rating,
                        name: users.name,
                    });
                }

                console.log(reviewsData);

                setReviews(reviewsData);
                setTotal(count);
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

    useEffect(() => {
        getRatings({
            offset: 0,
            limit: itemsPerPage,
        });
    }, []);

    const handlePaginationChange = (page, pageSize) => {
        setCurrentPage(page);
        setItemsPerPage(pageSize);

        getRatings({
            offset: pageSize,
            limit: (page - 1) * pageSize,
        });
    };

    const onFinish = (values) => {
        let data = {
            ...values,
        };
        if (!values.rating) data["rating"] = 0;

        post("/reviews/create", data, {
            Authorization: `bearer ${user.access_token}`,
        })
            .then((response) => {
                messageApi.open({
                    type: "success",
                    content: "Send rating successfully",
                });
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
                    form={form}
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
