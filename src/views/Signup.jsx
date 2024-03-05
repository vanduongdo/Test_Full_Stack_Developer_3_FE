import React, { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
    Button,
    Checkbox,
    Spin,
    Form,
    Input,
    Card,
    Row,
    Col,
    Typography,
} from "antd";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

const { Text } = Typography;

function Signup() {
    const [form] = Form.useForm();
    const { setUser, setToken } = useStateContext();

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);

    const onFinish = (values) => {
        setLoading(true);
        axiosClient
            .post("/signup", values)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.token);
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
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
                    <Card title="Signup">
                        <Form
                            form={form}
                            name="normal_login"
                            className="login-form"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                        >
                            <Form.Item
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your name!",
                                    },
                                ]}
                            >
                                <Input
                                    prefix={
                                        <UserOutlined className="site-form-item-icon" />
                                    }
                                    placeholder="name"
                                />
                            </Form.Item>
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
                                            <Text type="danger" style={{display: "block", marginBottom: 8}} key={key}>*{errors[key][0]}</Text>
                                        ))}
                                    </div>
                                )}
                                <Button
                                    style={{ width: "100%", marginBottom: 8 }}
                                    type="primary"
                                    htmlType="submit"
                                    className="login-form-button"
                                >
                                    Register
                                </Button>
                                Or <a href="/login">Login now!</a>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Spin>
    );
}

export default Signup;
