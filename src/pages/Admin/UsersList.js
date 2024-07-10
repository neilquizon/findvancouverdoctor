import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ShowLoader } from '../../redux/loaderSlice';
import { Table, message } from 'antd';
import { GetAllUsers } from '../../apicalls/users';
import './UsersList.css'; // Ensure you create this CSS file

function UsersList() {
  const [users, setUsers] = React.useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(ShowLoader(true));
      const response = await GetAllUsers();
      dispatch(ShowLoader(false));
      if (response.success) {
        setUsers(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(ShowLoader(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Role', dataIndex: 'role' },
    { title: 'Status', dataIndex: 'status' }
  ];

  return (
    <div className="table-container">
      <Table columns={columns} dataSource={users} pagination={false} scroll={{ x: true }} />
    </div>
  );
}

export default UsersList;
