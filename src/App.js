import "./App.css";
// import  'antd/dist/antd.less';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import { Breadcrumb } from "antd";
import Sidebar from "./Sidebar";
import UserInfo from "./UserInfo";
import ReportService from "./ReportService";

const { Header, Content, Sider } = Layout;

const items2 = [
  {
    key: "1",
    label: "Thông tin",
    path: "/thong-tin",
  },
  {
    key: "2",
    label: "Báo cáo",
    path: "/bao-cao",
  },
];

function App() {
  return (
    <Router>
      <Layout>
        <Header
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <span style={{ color: "white" }}>HỆ THỐNG GIÁM SÁT LOG</span>
        </Header>
        <Layout>
          <Sider
            width={200}
            style={{
              background: "white",
            }}
          >
            <Menu
              mode="inline"
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={["sub1"]}
              style={{
                height: "100%",
                borderRight: 0,
              }}
              items={items2.map((item) => ({
                key: item.key,
                label: <Link to={item.path}>{item.label}</Link>,
              }))}
            />
          </Sider>
          <Layout
            style={{
              padding: "0 24px 24px",
            }}
          >
            <Breadcrumb
              style={{
                margin: "16px 0",
              }}
            >
              <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
              <Breadcrumb.Item>Server</Breadcrumb.Item>
            </Breadcrumb>

            <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
              <Routes>
                {/* <Route path="/thong-tin" element={<UserInfo />} /> */}
                <Route path="/bao-cao" element={<ReportService />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
