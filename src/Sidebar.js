import { Menu } from 'antd';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <Menu mode="inline" theme="dark">
      <Menu.Item key="1">
        <Link to="/thong-tin">Thông tin</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/bao-cao">Báo cáo</Link>
      </Menu.Item>
    </Menu>
  );
}

export default Sidebar;