import React, { useState } from "react";
import { Avatar, Card, Row, Col, Typography, notification, Space } from "antd";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";

const { Text, Title } = Typography;

const gridStyle = {
    width: "25%",
    textAlign: "center",
};

const packages = [
    {
        id: 1,
        name: "Starter",
        limit_todo: 50,
        price: "$29",
    },
    {
        id: 2,
        name: "Professional",
        limit_todo: 500,
        price: "$99",
    },
    {
        id: 3,
        name: "Premium",
        limit_todo: "unlimit",
        price: "$299",
    },
];

function Packages() {
    const [loading, setLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();

    const handleUpdatePackage = (item) => {
        axiosClient
            .post("/update-subscription", item)
            .then(({ data }) => {
                if (data) {
                    openNotificationWithIcon(
                        "success",
                        "Update Subscription Success"
                    );
                }
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const openNotificationWithIcon = (type, message) => {
        api[type]({
            message: message,
            description: "This is the content of the notification.",
        });
    };

    return (
        <>
            {contextHolder}
            <Title style={{ textAlign: "center" }}>
                Your Subscription is Premium
            </Title>
            <Title
                level={6}
                style={{
                    textAlign: "center",
                    fontSize: "1.1rem",
                    fontWeight: "400",
                    marginBottom: "2rem",
                }}
                type="secondary"
            >
                01/03/2024 - 01/04/2024
            </Title>
            <Row justify="space-between" gutter={[8, 8]}>
                {packages.map((item) => {
                    return (
                        <Col
                            span={8}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <Card
                                hoverable
                                style={{
                                    width: 300,
                                }}
                                cover={
                                    <img
                                        alt="example"
                                        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                                    />
                                }
                                onClick={() => handleUpdatePackage(item)}
                            >
                                <div style={{ textAlign: "center" }}>
                                    <Title level={2}>{item.price}</Title>

                                    <Title level={4}>{item.name}</Title>
                                    <Text type="secondary">
                                        {item.limit_todo} todos
                                    </Text>
                                </div>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        </>
    );
}

export default Packages;
