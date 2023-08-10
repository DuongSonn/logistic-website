import React, { useEffect } from "react";
import { getLocalStorageItem } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import {
    OrderedListOutlined,
    MessageOutlined,
    StarOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
const { Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}

const items = [
    getItem("Orders", "orders", <OrderedListOutlined />, null),
    getItem("Chat", "chat", <MessageOutlined />, null),
    getItem("Rates", "rates", <StarOutlined />, null),
];

function BaseLayout({ children }) {
    const navigate = useNavigate();

    useEffect(() => {
        const userData = getLocalStorageItem("user");
        if (!userData) {
            navigate("/login");
        }
    }, []);

    const onClickItem = (e) => {
        navigate(`/${e.keyPath[0]}`);
    };

    return (
        <Layout hasSider>
            <Sider
                style={{
                    overflow: "auto",
                    height: "100vh",
                    position: "fixed",
                    left: 0,
                    top: 0,
                    bottom: 0,
                }}
            >
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={["4"]}
                    items={items}
                    onClick={onClickItem}
                />
            </Sider>
            <Layout
                className="site-layout"
                style={{
                    marginLeft: 200,
                }}
            >
                <Content
                    style={{
                        margin: "24px 16px 0",
                        overflow: "initial",
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}

export default BaseLayout;
