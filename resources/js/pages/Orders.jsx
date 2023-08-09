import React, { useState, useEffect } from "react";
import BaseLayout from "../components/BaseLayout";
import {
    Table,
    Row,
    Col,
    Pagination,
    Input,
    DatePicker,
    Button,
    Modal,
    Form,
    message,
} from "antd";
import { get, post, put } from "../utils/request";
import { getLocalStorageItem } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";

function Orders() {
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [totalOrders, setTotalOrders] = useState(0);
    const [open, setOpen] = useState(false);
    const [orders, setOrders] = useState([]);
    const [searchNumberOrder, setSearchNumberOrder] = useState("");
    const [searchCustomerName, setSearchCustomerName] = useState("");
    const [searchShippingDate, setSearchShippingDate] = useState(0);

    const user = JSON.parse(getLocalStorageItem("user"));
    const getOrders = (filter) => {
        get(
            "/orders/list",
            {
                ...filter,
            },
            {
                Authorization: `bearer ${user.access_token}`,
            }
        )
            .then((response) => {
                const data = response.data.data;
                const { orders, count } = data;

                const ordersData = [];
                for (const item of orders) {
                    const { id, shipping_date, number_order, user } = item;
                    ordersData.push({
                        key: id,
                        number_order,
                        shipping_date,
                        customer_name: user.name,
                    });
                }

                setOrders(ordersData);
                setTotalOrders(count);
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

    useEffect(() => {
        getOrders({
            limit: itemsPerPage,
            offset: (currentPage - 1) * itemsPerPage,
        });
    }, []);

    useEffect(() => {
        let filter = {
            limit: itemsPerPage,
            offset: (currentPage - 1) * itemsPerPage,
        };
        if (searchCustomerName !== "") {
            filter["customer_name"] = searchCustomerName;
        }
        if (searchNumberOrder !== "") {
            filter["number_order"] = searchNumberOrder;
        }
        if (searchShippingDate !== 0) {
            filter["shipping_date"] = searchShippingDate;
        }

        getOrders(filter);
    }, [searchCustomerName, searchNumberOrder, searchShippingDate]);

    const columns = [
        {
            title: "Number Order",
            dataIndex: "number_order",
            key: "number_order",
        },
        {
            title: "Customer Name",
            dataIndex: "customer_name",
            key: "customer_name",
        },
        {
            title: "Shipping Date",
            dataIndex: "shipping_date",
            key: "shipping_date",
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => {
                return (
                    <Button onClick={() => onClickDetailOrder(record)}>
                        Detail
                    </Button>
                );
            },
        },
    ];

    const handlePaginationChange = (page, pageSize) => {
        setCurrentPage(page);
        setItemsPerPage(pageSize);

        getOrders({
            limit: pageSize,
            offset: (page - 1) * pageSize,
        });
    };

    // Handle search data
    const onSearchOrderNumber = (value) => {
        setSearchNumberOrder(value);
    };
    const onSearchCustomerName = (value) => {
        setSearchCustomerName(value);
    };
    const onSearchShippingDate = (date, dateString) => {
        if (dateString != "") {
            setSearchShippingDate(
                moment.tz(dateString, "YYYY-MM-DD", "Asia/Ho_Chi_Minh").unix()
            );
        } else {
            setSearchShippingDate(0);
        }
    };

    // Handle modal
    const showModal = () => {
        setOpen(true);
    };
    const handleCancel = () => {
        console.log("Clicked cancel button");
        setOpen(false);
    };

    //
    const onSubmit = (values) => {
        console.log("Success:", values);
        setOpen(false);
    };

    //
    const onClickDetailOrder = (data) => {
        console.log(data);
        setOpen(true);
    };

    return (
        <>
            {contextHolder}
            <BaseLayout>
                <Row gutter={24} style={{ marginBottom: "16px" }}>
                    <Col span={6}>
                        <Input.Search
                            placeholder="Search number order"
                            onSearch={onSearchOrderNumber}
                            style={{}}
                        />
                    </Col>
                    <Col span={6}>
                        <Input.Search
                            placeholder="Search customer name"
                            onSearch={onSearchCustomerName}
                            style={{}}
                        />
                    </Col>
                    <Col span={6}>
                        <DatePicker
                            onChange={onSearchShippingDate}
                            placeholder="Search shipping date"
                            style={{}}
                        />
                    </Col>
                    <Col span={6}>
                        <Button type="primary" onClick={showModal}>
                            Open Modal with async logic
                        </Button>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={24}>
                        <Table
                            dataSource={orders}
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
                            total={totalOrders}
                            showSizeChanger
                            showTotal={(total) => `Total ${total} items`}
                            onChange={handlePaginationChange}
                        />
                    </Col>
                </Row>
            </BaseLayout>

            <Modal
                title="Title"
                open={open}
                onCancel={handleCancel}
                footer={null}
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
                    onFinish={onSubmit}
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
                        wrapperCol={{
                            offset: 20,
                            span: 4,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default Orders;
