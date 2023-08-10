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
    Select,
} from "antd";
import { get, post, put, remove } from "../utils/request";
import { getLocalStorageItem } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import Pusher from "pusher-js";
import Echo from "laravel-echo";

const TIMEZONE = "Asia/Ho_Chi_Minh";

function Orders() {
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [totalOrders, setTotalOrders] = useState(0);
    const [open, setOpen] = useState(false);
    const [orders, setOrders] = useState([]);
    const [searchNumberOrder, setSearchNumberOrder] = useState("");
    const [searchCustomerName, setSearchCustomerName] = useState("");
    const [searchShippingDate, setSearchShippingDate] = useState(0);
    const [numberOfProducts, setNumberOfProducts] = useState(1);
    const [modalTitle, setModalTitle] = useState("Create Order");
    const [products, setProducts] = useState([]);
    const [order, setOrder] = useState({});

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
                    const { id, shipping_date, number_order, user, status } =
                        item;
                    ordersData.push({
                        key: id,
                        number_order,
                        shipping_date: moment
                            .unix(shipping_date)
                            .tz(TIMEZONE)
                            .format("YYYY-MM-DD"),
                        customer_name: user.name,
                        status,
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
    const getProducts = () => {
        get(
            "/products/list",
            {},
            {
                Authorization: `bearer ${user.access_token}`,
            }
        )
            .then((response) => {
                const data = response.data.data;
                setProducts(data);
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
        getProducts();
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

    useEffect(() => {
        Pusher.logToConsole = true;

        const pusher = new Pusher("6c674ea590e0817e5b80", {
            cluster: "ap1",
        });

        const channel = pusher.subscribe("orders");
        channel.bind("order_updated", function (data) {
            const { role, user_id } = user;
            if (
                user_id == data.message ||
                role === "admin" ||
                role === "transporter"
            ) {
                console.log("refresh orders");
                getOrders({
                    limit: itemsPerPage,
                    offset: 0,
                });
            }
        });
    }, []);

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
            title: "Status",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => {
                return (
                    <>
                        <Button onClick={() => onClickDetailOrder(record)}>
                            Detail
                        </Button>
                        <Button onClick={() => onClickDeleteOrder(record)}>
                            Delete
                        </Button>
                    </>
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
                moment.tz(dateString, "YYYY-MM-DD", TIMEZONE).unix()
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
        console.log("cancel");
        setOrder({});
        form.resetFields();

        setOpen(false);
    };

    //
    const onSubmit = (values) => {
        const products = [];
        let productsMemo = {};
        for (const key in values) {
            if (!key.includes("product_")) {
                continue;
            }
            const keyArr = key.split(`_`);
            const index = keyArr[2];
            const item = keyArr[1];
            if (productsMemo[index]) {
                productsMemo[index] = {
                    ...productsMemo[index],
                    [item]: values[key],
                };
            } else {
                productsMemo = {
                    ...productsMemo,
                    [index]: { [item]: values[key] },
                };
            }
        }
        for (const key in productsMemo) {
            products.push(productsMemo[key]);
        }

        const {
            delivery_date,
            shipping_date,
            shipping_address,
            delivery_address,
        } = values;
        let params = {
            shipping_address,
            delivery_address,
            products,
            delivery_date: moment
                .tz(
                    delivery_date.format("YYYY-MM-DD"),
                    "YYYY-MM-DD",
                    "Asia/Ho_Chi_Minh"
                )
                .unix(),
            shipping_date: moment
                .tz(
                    shipping_date.format("YYYY-MM-DD"),
                    "YYYY-MM-DD",
                    "Asia/Ho_Chi_Minh"
                )
                .unix(),
        };

        if (Object.keys(order).length !== 0) {
            params = {
                ...params,
                id: values.id,
                status: values.status,
            };

            put("/orders/update", params, {
                Authorization: `bearer ${user.access_token}`,
            })
                .then((response) => {
                    getOrders({
                        limit: itemsPerPage,
                        offset: 0,
                    });

                    messageApi.open({
                        type: "success",
                        content: "Update order successfully",
                    });
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
        } else {
            post("/orders/create", params, {
                Authorization: `bearer ${user.access_token}`,
            })
                .then((response) => {
                    getOrders({
                        limit: itemsPerPage,
                        offset: 0,
                    });

                    messageApi.open({
                        type: "success",
                        content: "Create order successfully",
                    });
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
        }

        setOpen(false);
        form.resetFields();
    };

    //
    const onClickDetailOrder = (data) => {
        get(
            "/orders/info",
            {
                id: data.key,
            },
            {
                Authorization: `bearer ${user.access_token}`,
            }
        )
            .then((response) => {
                const data = response.data.data;
                setOrder(data);

                setOpen(true);
                setModalTitle("Detail Order");
                setNumberOfProducts(data.order_details.length);

                let updateField = {
                    id: data.id,
                    customer_name: data.user.name,
                    number_order: data.number_order,
                    shipping_date: moment.unix(data.shipping_date).tz(TIMEZONE),
                    delivery_date: moment.unix(data.delivery_date).tz(TIMEZONE),
                    delivery_address: data.delivery_address,
                    shipping_address: data.shipping_address,
                    status: data.status,
                };
                for (let i = 0; i < data.order_details.length; i++) {
                    const item = data.order_details[i];
                    updateField = {
                        ...updateField,
                        [`product_id_${i}`]: item.product_id,
                        [`product_amount_${i}`]: item.amount,
                    };
                }

                form.setFieldsValue(updateField);
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

    const onClickDeleteOrder = (data) => {
        remove(
            "/orders/remove",
            {
                id: data.key,
            },
            {
                Authorization: `bearer ${user.access_token}`,
            }
        )
            .then((response) => {
                getOrders({
                    limit: itemsPerPage,
                    offset: 0,
                });
                messageApi.open({
                    type: "success",
                    content: "Remove order successfully!",
                });

                form.setFieldsValue(updateField);
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
                            Create Order
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
                title={modalTitle}
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
                    form={form}
                >
                    <Form.Item label="id" name="id" hidden={true}>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Number Order"
                        name="number_order"
                        hidden={Object.keys(order).length === 0}
                    >
                        <Input disabled={true} />
                    </Form.Item>
                    <Form.Item
                        label="Customer Name"
                        name="customer_name"
                        hidden={Object.keys(order).length === 0}
                    >
                        <Input disabled={true} />
                    </Form.Item>
                    <Form.Item
                        label="Status"
                        name="status"
                        hidden={Object.keys(order).length === 0}
                    >
                        <Select placeholder="Select Status">
                            <Select.Option value={"pending"}>
                                Pending
                            </Select.Option>
                            <Select.Option value={"delivering"}>
                                Delivering
                            </Select.Option>
                            <Select.Option value={"canceled"}>
                                Canceled
                            </Select.Option>
                            <Select.Option value={"completed"}>
                                Completed
                            </Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Shipping Date"
                        name="shipping_date"
                        rules={[
                            {
                                required: true,
                                message: "Please input your shipping date!",
                            },
                        ]}
                    >
                        <DatePicker
                            disabled={Object.keys(order).length !== 0}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Delivery Date"
                        name="delivery_date"
                        rules={[
                            {
                                required: true,
                                message: "Please input your delivery date!",
                            },
                        ]}
                    >
                        <DatePicker
                            disabled={Object.keys(order).length !== 0}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Shipping Address"
                        name="shipping_address"
                        rules={[
                            {
                                required: true,
                                message: "Please input your shipping address!",
                            },
                        ]}
                    >
                        <Input disabled={Object.keys(order).length !== 0} />
                    </Form.Item>
                    <Form.Item
                        label="Delivery Address"
                        name="delivery_address"
                        rules={[
                            {
                                required: true,
                                message: "Please input your delivery address!",
                            },
                        ]}
                    >
                        <Input disabled={Object.keys(order).length !== 0} />
                    </Form.Item>
                    {[...Array(numberOfProducts)].map((_, index) => (
                        <Form.Item
                            label="Products"
                            style={{
                                marginBottom: 0,
                            }}
                        >
                            <Form.Item
                                name={`product_id_${index}`}
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                                style={{
                                    display: "inline-block",
                                    width: "calc(50% - 8px)",
                                }}
                            >
                                <Select
                                    placeholder="Select Product"
                                    disabled={Object.keys(order).length !== 0}
                                >
                                    {products.map((product) => (
                                        <Select.Option value={product.id}>
                                            {product.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={`product_amount_${index}`}
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                                style={{
                                    display: "inline-block",
                                    width: "calc(50% - 8px)",
                                    margin: "0 8px",
                                }}
                            >
                                <Input
                                    placeholder="Amount"
                                    disabled={Object.keys(order).length !== 0}
                                />
                            </Form.Item>
                        </Form.Item>
                    ))}
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
