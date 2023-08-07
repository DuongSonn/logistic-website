import React, { useState } from "react";
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
} from "antd";

function Orders() {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState("Content of the modal");
    const dataSource = [
        {
            key: "1",
            name: "Mike",
            age: 32,
            address: "10 Downing Street",
        },
        {
            key: "2",
            name: "John",
            age: 42,
            address: "10 Downing Street",
        },
    ];

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Age",
            dataIndex: "age",
            key: "age",
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => {
                return (
                    <Button onClick={() => onClickDetailOrder(record)}>
                        Invite {record.name}
                    </Button>
                );
            },
        },
    ];

    const handlePaginationChange = (page, pageSize) => {
        setCurrentPage(page);
        setItemsPerPage(pageSize);
    };

    // Calculate the starting index and ending index for the data slice
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Slice the data to display only the items for the current page
    const paginatedData = dataSource.slice(startIndex, endIndex);

    // Handle search data
    const onSearchOrderNumber = (value) => console.log(value);
    const onSearchCustomerName = (value) => console.log(value);
    const onSearchShippingDate = (date, dateString) => {
        console.log(date, dateString);
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
            <BaseLayout>
                <Row gutter={24} style={{ marginBottom: "16px" }}>
                    <Col span={6}>
                        <Input.Search
                            placeholder="input search text"
                            onSearch={onSearchOrderNumber}
                            style={{
                                width: 200,
                            }}
                        />
                    </Col>
                    <Col span={6}>
                        <Input.Search
                            placeholder="input search text"
                            onSearch={onSearchCustomerName}
                            style={{
                                width: 200,
                            }}
                        />
                    </Col>
                    <Col span={6}>
                        <DatePicker onChange={onSearchShippingDate} />
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
                            dataSource={dataSource}
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
                            total={dataSource.length}
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
                confirmLoading={confirmLoading}
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
