import React, { useEffect, useState } from "react";

import {
    Space,
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    DatePicker,
    Typography,
    notification,
    Popconfirm,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";

import dayjs from "dayjs";

const { TextArea } = Input;
const { Text, Link } = Typography;

const CollectionCreateForm = ({ initialValues, onFormInstanceReady, item }) => {
    const [form] = Form.useForm();
    useEffect(() => {
        onFormInstanceReady(form);
    }, []);

    if (item.id) {
        item["due_date"] = dayjs(item.due_date);
        form.setFieldsValue(item);
    }

    return (
        <Form
            form={form}
            layout="horizontal"
            name="wrap"
            labelCol={{ flex: "110px" }}
            labelAlign="left"
            labelWrap
            wrapperCol={{ flex: 1 }}
            colon={false}
            style={{ maxWidth: 600, padding: "30px 0" }}
        >
            <Form.Item label="Title" name="title" rules={[{ required: true }]}>
                <Input />
            </Form.Item>

            <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true }]}
            >
                <TextArea rows={4} />
            </Form.Item>

            <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true }]}
            >
                <Select>
                    <Select.Option value={0} key="0">
                        Uncomplete
                    </Select.Option>
                    <Select.Option value={1} key="1">
                        Process
                    </Select.Option>
                    <Select.Option value={2} key="2">
                        Completed
                    </Select.Option>
                </Select>
            </Form.Item>
            <Form.Item
                label="Due date"
                name="due_date"
                rules={[{ required: true }]}
            >
                <DatePicker style={{ width: "100%" }} />
            </Form.Item>
        </Form>
    );
};

const CollectionCreateFormModal = ({
    open,
    onCreate,
    item,
    onCancel,
    initialValues,
}) => {
    const [formInstance, setFormInstance] = useState();
    return (
        <Modal
            open={open}
            title={`${!item.id ? "Add Todo" : "Edit Todo"}`}
            okText="Save"
            cancelText="Cancel"
            okButtonProps={{
                autoFocus: true,
            }}
            onCancel={onCancel}
            destroyOnClose
            onOk={async () => {
                try {
                    const values = await formInstance?.validateFields();
                    formInstance?.resetFields();
                    onCreate(values);
                } catch (error) {
                    console.log("Failed:", error);
                }
            }}
        >
            <CollectionCreateForm
                initialValues={initialValues}
                onFormInstanceReady={(instance) => {
                    setFormInstance(instance);
                }}
                item={item}
            />
        </Modal>
    );
};

function TodoList() {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [item, setItem] = useState({});

    const { user, token } = useStateContext();
    const [form] = Form.useForm();

    const [open, setOpen] = useState(false);

    useEffect(() => {
        getList();
    }, []);

    const getList = () => {
        axiosClient
            .get("/list-todo")
            .then(({ data }) => {
                if (data.data) {
                    setDataSource(data.data);
                }
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const onCreate = (values) => {
        setLoading(true);
        if (!item.id) {
            axiosClient
                .post("/create-todo", values)
                .then(({ data }) => {
                    if (data) {
                        let dataSourceCP = [...dataSource];
                        setDataSource([data, ...dataSourceCP]);
                        openNotificationWithIcon("success", "Add Todo Success");
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            values.id = item.id;
            axiosClient
                .post("/update-todo", values)
                .then(({ data }) => {
                    if (data) {
                        let dataSourceCP = [...dataSource];
                        let index = dataSource.findIndex(
                            (item) => item.id === values.id
                        );
                        dataSourceCP[index] = values;
                        setDataSource([...dataSourceCP]);
                        openNotificationWithIcon(
                            "success",
                            "Update Todo Success"
                        );
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
        setOpen(false);
    };

    const handleUpdate = (value) => {
        setItem(value);
        setOpen(true);
    };

    const handleCreate = () => {
        setItem({});
        setOpen(true);
    };

    const confirm = (id) => {
        setLoading(true);
        axiosClient
        .post("/delete-todo", {id})
        .then(({ data }) => {
            if (data) {
                let dataSourceCP = [...dataSource];
                let filterDataSource = dataSourceCP.filter((item) => item.id !== id)
                setDataSource([...filterDataSource]);
                openNotificationWithIcon(
                    "success",
                    "Delete Todo Success"
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

    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type, message) => {
        api[type]({
            message: message,
            description: "This is the content of the notification.",
        });
    };

    const columns = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            width: 200,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (text) => (
                <Text
                    style={{ maxWidth: 500 }}
                    ellipsis={{
                        rows: 1,
                    }}
                >
                    {text}
                </Text>
            ),
        },
        {
            title: "Status",
            width: 150,
            dataIndex: "status",
            key: "status",
            render: (_, { status }) => {
                if (status === 0) {
                    return <Text>Uncomplete</Text>;
                } else if (status === 1) {
                    return <Text>Process</Text>;
                } else {
                    return <Text>Completed</Text>;
                }
            },
        },
        {
            title: "Due Date",
            key: "due_date",
            dataIndex: "due_date",
            width: 150,
            render: (_, { due_date }) => dayjs(due_date).format("YYYY-MM-DD"),
        },
        {
            title: "Action",
            key: "action",
            width: 150,
            align: "center",
            render: (_, record) => (
                <Space size="middle">
                    <Link onClick={() => handleUpdate(record)}>
                        <EditOutlined />
                    </Link>
                    <Link>
                        <Popconfirm
                            title="Delete the todo"
                            description="Are you sure to delete this todo?"
                            onConfirm={() => confirm(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="link" danger>
                                <DeleteOutlined />
                            </Button>
                        </Popconfirm>
                    </Link>
                </Space>
            ),
        },
    ];

    // useEffect(() => {
    //     getUsers();
    // }, []);

    // const getUsers = () => {
    //     setLoading(true);
    //     axiosClient
    //         .get("/users")
    //         .then(({ data }) => {
    //             setLoading(false);
    //             setUser(data.data);
    //         })
    //         .catch(() => {
    //             setLoading(false);
    //         });
    // };

    return (
        <>
            {contextHolder}
            <Button
                onClick={() => handleCreate()}
                type="primary"
                style={{
                    marginBottom: 16,
                }}
            >
                Add a row
            </Button>
            <Table
                columns={columns}
                dataSource={dataSource}
                pagination={true}
            />
            <CollectionCreateFormModal
                open={open}
                onCreate={onCreate}
                item={item}
                onCancel={() => setOpen(false)}
                initialValues={{
                    modifier: "public",
                }}
            />
        </>
    );
}

export default TodoList;
