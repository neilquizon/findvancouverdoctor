import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Table, message, Modal, Select } from "antd";
import { ShowLoader } from "../../redux/loaderSlice";
import { GetAppointments, DeleteAppointment, UpdateAppointmentStatus } from "../../apicalls/appointments";
import moment from 'moment';

const { Option } = Select;

function AppointmentsList() {
  const [appointments, setAppointments] = React.useState([]);
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));

  const getData = async () => {
    try {
      dispatch(ShowLoader(true));
      const response = await GetAppointments();
      dispatch(ShowLoader(false));
      if (response.success) {
        setAppointments(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(ShowLoader(false));
      message.error(error.message);
    }
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this appointment?',
      onOk: () => onDelete(id),
    });
  };

  const onDelete = async (id) => {
    try {
      dispatch(ShowLoader(true));
      const response = await DeleteAppointment(id);
      dispatch(ShowLoader(false));
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(ShowLoader(false));
      message.error(error.message);
    }
  };

  const onUpdate = async (id, status) => {
    try {
      dispatch(ShowLoader(true));
      const response = await UpdateAppointmentStatus(id, status);
      dispatch(ShowLoader(false));
      if (response.success) {
        message.success(response.message);
        getData();
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

  const handleChangeStatus = (id, value) => {
    onUpdate(id, value);
  };

  const columns = [
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Time", dataIndex: "slot", key: "slot" },
    { title: "Doctor", dataIndex: "doctorName", key: "doctorName" },
    { title: "Patient", dataIndex: "userName", key: "userName" },
    { title: "Booked At", dataIndex: "bookedOn", key: "bookedOn" },
    { title: "Problem", dataIndex: "problem", key: "problem" },
    { title: "Status", dataIndex: "status", key: "status" },
  ];

  if (user.role === "doctor" || user.role === "admin") {
    columns.push({
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => {
        const isPastDate = moment(record.date).isBefore(moment(), 'day');
        if (user.role === "admin" || !isPastDate) {
          return (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Select
                value={record.status}
                onChange={(value) => handleChangeStatus(record.id, value)}
                style={{ width: 120 }}
              >
                <Option value="pending">Pending</Option>
                <Option value="approved">Approved</Option>
                <Option value="cancelled">Cancelled</Option>
                <Option value="completed">Completed</Option>
                <Option value="no show">No Show</Option>
                <Option value="in progress">In Progress</Option>
              </Select>
              <span
                style={{ textDecoration: 'underline', cursor: 'pointer' }}
                onClick={() => confirmDelete(record.id)}
              >
                Delete
              </span>
            </div>
          );
        }
        return null;
      }
    });
  }

  return (
    <div className="table-container">
      <Table
        columns={columns}
        dataSource={appointments}
        pagination={false}
        rowKey="id"
        scroll={{ x: 600 }} // Enable horizontal scrolling on smaller screens
      />
    </div>
  );
}

export default AppointmentsList;
