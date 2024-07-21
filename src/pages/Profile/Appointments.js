import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ShowLoader } from '../../redux/loaderSlice';
import { Table, message, Modal, DatePicker } from 'antd';
import { GetDoctorAppointments, GetUserAppointments, UpdateAppointmentStatus, DeleteAppointment, UpdateAppointmentDate } from '../../apicalls/appointments';
import './Appointments.css'; // Ensure you create this CSS file

function Appointments() {
  const [appointments, setAppointments] = React.useState([]);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [selectedAppointment, setSelectedAppointment] = React.useState(null);
  const [newDate, setNewDate] = React.useState(null);
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

  const onUpdateDate = async () => {
    if (!newDate) {
      message.error("Please select a new date");
      return;
    }
    try {
      dispatch(ShowLoader(true));
      const response = await UpdateAppointmentDate(selectedAppointment.id, newDate);
      dispatch(ShowLoader(false));
      if (response.success) {
        message.success(response.message);
        getData();
        setIsModalVisible(false);
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

  const showConfirm = (id, isDoctor) => {
    Modal.confirm({
      title: 'Are you sure you want to cancel this appointment?',
      onOk() {
        if (isDoctor) {
          onUpdate(id, "cancelled");
        } else {
          onDelete(id);
        }
      }
    });
  };

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
        if (user.role === "doctor" && record.status === "pending") {
          return (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span
                style={{ textDecoration: 'underline', cursor: 'pointer' }}
                onClick={() => onUpdate(record.id, "approved")}
              >
                Approve
              </span>
              <span
                style={{ textDecoration: 'underline', cursor: 'pointer' }}
                onClick={() => showConfirm(record.id, true)}
              >
                Cancel
              </span>
            </div>
          );
        }
        return null;
      }
    },
    {
      title: 'Modify',
      dataIndex: 'modify',
      key: 'modify',
      render: (text, record) => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user.role === "user") {
          return (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span
                style={{ textDecoration: 'underline', cursor: 'pointer' }}
                onClick={() => showConfirm(record.id, false)}
              >
                Cancel
              </span>
              <span
                style={{ textDecoration: 'underline', cursor: 'pointer' }}
                onClick={() => {
                  setSelectedAppointment(record);
                  setIsModalVisible(true);
                }}
              >
                Reschedule
              </span>
            </div>
          );
        }
        return null;
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

      <Modal
        title="Reschedule Appointment"
        visible={isModalVisible}
        onOk={onUpdateDate}
        onCancel={() => setIsModalVisible(false)}
      >
        <DatePicker
          format="YYYY-MM-DD"
          onChange={(date, dateString) => setNewDate(dateString)}
        />
      </Modal>
    </div>
  );
}

export default Appointments;
