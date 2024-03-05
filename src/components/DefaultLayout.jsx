import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import {
    Breadcrumb,
    Layout,
    Menu,
    theme,
    Typography,
    Avatar,
    Dropdown,
    Space,
    message,
    Tag,
    Row,
    Col,
} from "antd";

import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";
const { Header, Content, Footer } = Layout;
const { Text, Link } = Typography;


function DefaultLayout() {
    const { user, token, setUser, setToken } = useStateContext();
    const navigate = useNavigate();
    useEffect(() => {
        axiosClient.get("/user").then(({ data }) => {
            console.log(data);
            setUser(data);
        });
    }, []);

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    if (!token) {
        return <Navigate to="/login" />;
    }

    const onLogout = () => {
        axiosClient.post("/logout").then(() => {
            setUser({});
            setToken(null);
        });
    };

    const itemsDropdown = [
        {
            label: "Logout",
            key: "logout",
            danger: true,
            onClick: onLogout,
        },
    ];

    const items = [
        {
            key: "packages",
            label: "Packages",
        },
    ];

    const onClick = (e) => {
        return navigate(`/${e.key}`);
    };

    return (
        <Layout>
            <Header
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <div className="demo-logo" style={{ marginRight: "10px" }}>
                    <Link
                        href="/"
                        style={{
                            fontSize: "1.3rem",
                            fontWeight: "bold",
                            color: "#fff",
                        }}
                    >
                        Todo List
                    </Link>
                </div>
                <Menu
                    onClick={onClick}
                    theme="dark"
                    mode="horizontal"
                    items={items}
                    style={{
                        flex: 1,
                        minWidth: 0,
                    }}
                />
                <div className="user-avatar">
                    <Row>
                        <Col
                            span={16}
                            style={{
                                textAlign: "center",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "175px",
                            }}
                        >
                            <Text
                                style={{
                                    color: "#fff",
                                    textAlign: "center",
                                    marginRight: 8,
                                }}
                            >
                                {user.name}
                            </Text>
                            <Link href="/packages"><Tag color="cyan">Free</Tag></Link>
                        </Col>
                        <Col span={8}>
                            <Dropdown
                                menu={{ items: itemsDropdown }}
                                placement="bottom"
                                arrow
                                trigger={["click"]}
                            >
                                <a onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        <Avatar
                                            size="large"
                                            icon={<UserOutlined />}
                                        />
                                    </Space>
                                </a>
                            </Dropdown>
                        </Col>
                    </Row>
                </div>
            </Header>
            <Content
                style={{
                    padding: "0 48px",
                }}
            >
                <Breadcrumb
                    style={{
                        margin: "16px 0",
                    }}
                ></Breadcrumb>
                <div
                    style={{
                        padding: 24,
                        minHeight: 380,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet />
                </div>
            </Content>
            <Footer
                style={{
                    textAlign: "center",
                }}
            >
                Ant Design ©{new Date().getFullYear()} Created by Ant UED
            </Footer>
        </Layout>
    );
}

export default DefaultLayout;
