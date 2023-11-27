import React, { useState, useEffect } from "react";
import {
  Table,
  Row,
  Col,
  Card,
  Button,
  Form,
  Input,
  Tooltip,
  DatePicker,
  notification,
  Modal,
  Space,
} from "antd";
import {
  EditOutlined,
  FileExcelOutlined,
  DeleteOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { fetchList, delLog } from "./api";
import moment from "moment";
import * as XLSX from "xlsx";

const ReportService = () => {
  const [current, setCurrent] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRecord, setTotalRecord] = useState(0);

  const [data, setData] = useState([]);

  const [filterForm] = Form.useForm();
  const [filters, setFilters] = useState({
    keyword: "",
    date_from: "",
    date_to: "",
    ip: "",
  });

  const fetchData = async (offset = 0, limit = 10) => {
    const params = {
      ...filters, // Spread the filters object
      limit, // Add limit
      offset, // Add offset
    };
    const dataFromAPI = await fetchList(params);

    setData(dataFromAPI?.data);
    setTotalRecord(dataFromAPI?.totalCount);
  };

  useEffect(() => {
    fetchData((current - 1) * limit, limit);
  }, [current, limit, filters]);

  const formatDateValue = (timestamp) => {
    if (!timestamp) return null;
    return new Date(Number(timestamp)).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const exportTest = async () => {
    const params = {
      ...filters, // Spread the filters object
      offset: 0,
    };
    const dataExport = await fetchList(params);

    const formattedData = dataExport.data.map((item, index) => ({
      STT: index + 1,
      ...item,
      created_at: formatDateValue(item.created_at),
    }));

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(formattedData);
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    // Write workbook and trigger download
    XLSX.writeFile(wb, "Du_lieu_log.xlsx");
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Xác nhận xoá",
      content: "Bạn có chắc chắn muốn xoá bản ghi này?",
      okText: "Xoá",
      okType: "danger",
      cancelText: "Huỷ",
      onOk: async () => {
        try {
          const delResponse = await delLog(id); // Replace `accessToken` with your actual access token value
          // If deletion was successful, filter out the deleted record
          if (delResponse.code === 0) {
            fetchData((current - 1) * limit, limit);
            notification.success({ message: "Xoá thành công" });
          } else {
            notification.error({ message: delResponse.data.message });
          }
        } catch (error) {
          console.log(error);
        }
      },
    });
  };

  const commandsColumns = [
    {
      title: "STT",
      dataIndex: "STT",
      key: "STT",
      render: (_, record, index) => index + 1,
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (dob) => {
        return formatDateValue(dob);
      },
    },
    {
      title: "Người tạo",
      dataIndex: "created_by",
      key: "created_by",
    },
    {
      title: "Địa chỉ IP",
      dataIndex: "ip",
      key: "ip",
    },
    {
      title: "Log",
      dataIndex: "log",
      key: "log",
      ellipsis: true,
    },
    {
      title: "Tác vụ",
      key: "actions",
      render: (_, record) => (
        <Tooltip title="Xoá">
          <DeleteOutlined
            style={{ fontSize: "14px", color: "#E31D1C" }}
            onClick={() => handleDelete(record.id)}
          />
        </Tooltip>
      ),
      align: "center",
    },
  ];

  const handleTableChange = (pagination) => {
    setCurrent(pagination.current);
    setLimit(pagination.pageSize);
  };

  const handleFilterSubmit = (values) => {
    const newFilters = {
      ...filters,
      // Convert dates to timestamps or required format
      date_from: values.date_from ? values.date_from.valueOf() : "",
      date_to: values.date_to ? values.date_to.valueOf() : "",
      keyword: values.keyword || "",
      ip: values.ip || "",
    };
    setFilters(newFilters);
    console.log(newFilters);
  };

  const handleResetFilter = async () => {
    filterForm.resetFields();
    setFilters(null);
  };

  return (
    <Card
      title="Report Service"
      extra={
        <Button
          type="default"
          onClick={() => {
            exportTest();
          }}
          icon={<FileExcelOutlined style={{ fontSize: "17px" }} />}
        >
          Xuất file
        </Button>
      }
    >
      <Row>
        <Form
          form={filterForm}
          layout="horizontal"
          onFinish={handleFilterSubmit}
        >
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Từ ngày" name="date_from">
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="Chọn ngày"
                  format={"DD/MM/YYYY"}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="đến ngày" name="date_to">
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="Chọn ngày"
                  format={"DD/MM/YYYY"}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Từ khóa" name="keyword">
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Địa chỉ IP" name="ip">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="center">
            <Space>
              <Button type="default" onClick={handleResetFilter}>
                <SyncOutlined /> Reset
              </Button>

              <Button
                type="primary"
                htmlType="submit"
                style={{ marginLeft: "3px" }}
              >
                Tìm kiếm
              </Button>
            </Space>
          </Row>
        </Form>
      </Row>
      <Table
        columns={commandsColumns}
        dataSource={data}
        onChange={handleTableChange}
        pagination={{
          current: current,
          pageSize: limit,
          showSizeChanger: true,
          pageSizeOptions: ["10", "15", "20"],
          total: totalRecord,
        }}
      />
    </Card>
  );
};

export default ReportService;
