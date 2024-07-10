import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ShowLoader } from '../../redux/loaderSlice';
import { Table, message } from 'antd';
import { GetDoctorAppointments, GetUserAppointments, UpdateAppointmentStatus } from '../../apicalls/appointments';
import './Appointments.css'; // Ensure you create this CSS file

function Appointments() {
  const [appointments, setAppointments] = React.useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(ShowLoader(true));
      const user = JSON.parse(localStorage.getItem("user"));
      let response;
      if (user.role === "doctor") {
        response = await GetDoctorAppointments(user.id);
      } else {
        response = await GetUserAppointments(user.id);
      }
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

  const columns = [
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Time', dataIndex: 'slot', key: 'slot' },
    { title: 'Doctor', dataIndex: 'doctorName', key: 'doctorName' },
    { title: 'Patient', dataIndex: 'userName', key: 'userName' },
    { title: 'Booked At', dataIndex: 'bookedOn', key: 'bookedOn' },
    { title: 'Problem', dataIndex: 'problem', key: 'problem' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (record.status === "pending" && user.role === "doctor") {
          return (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span
                style={{ textDecoration: 'underline', cursor: 'pointer' }}
                onClick={() => onUpdate(record.id, "cancelled")}
              >
                Cancel
              </span>
              <span
                style={{ textDecoration: 'underline', cursor: 'pointer' }}
                onClick={() => onUpdate(record.id, "approved")}
              >
                Approve
              </span>
            </div>
          );
        }
      }
    }
  ];

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

export default Appointments;
