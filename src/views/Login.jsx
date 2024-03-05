import React, { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
    Button,
    Checkbox,
    Form,
    Input,
    Card,
    Row,
    Col,
    Spin,
    Typography,
} from "antd";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

const { Text } = Typography;

function Login() {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);

    const [form] = Form.useForm();
    const { setUser, setToken } = useStateContext();

    const onFinish = (values) => {
        setLoading(true);
        axiosClient
            .post("/login", values)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.token);
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors({
                        email: [response.data.message],
                    });
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Spin spinning={loading}>
            <Row gutter={[8, 8]} justify="center">
                <Col span={8}>
                    <Card title="Login">
                        <Form
                            form={form}
                            name="normal_login"
                            className="login-form"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                        >
                            <Form.Item
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your Email!",
                                    },
                                ]}
                            >
                                <Input
                                    prefix={
                                        <UserOutlined className="site-form-item-icon" />
                                    }
                                    placeholder="Email"
                                />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your Password!",
                                    },
                                ]}
                            >
                                <Input
                                    prefix={
                                        <LockOutlined className="site-form-item-icon" />
                                    }
                                    type="password"
                                    placeholder="Password"
                                />
                            </Form.Item>

                            <Form.Item>
                                {errors && (
                                    <div className="alert">
                                        {Object.keys(errors).map((key) => (
                                            <Text
                                                type="danger"
                                                style={{
                                                    display: "block",
                                                    marginBottom: 8,
                                                }}
                                                key={key}
                                            >
                                                *{errors[key][0]}
                                            </Text>
                                        ))}
                                    </div>
                                )}
                                <Button
                                    style={{ width: "100%", marginBottom: 8 }}
                                    type="primary"
                                    htmlType="submit"
                                    className="login-form-button"
                                >
                                    Login
                                </Button>
                                Or <a href="/signup">register now!</a>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Spin>
    );
}

export default Login;
