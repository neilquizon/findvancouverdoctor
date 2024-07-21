import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Table, message, Modal, DatePicker } from "antd";
import moment from "moment";
import { ShowLoader } from "../../redux/loaderSlice";
import { GetAppointments, DeleteAppointment, UpdateAppointmentDate } from "../../apicalls/appointments";

function AppointmentsList() {
  const [appointments, setAppointments] = React.useState([]);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [selectedAppointment, setSelectedAppointment] = React.useState(null);
  const [newDate, setNewDate] = React.useState(null);
  const dispatch = useDispatch();

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

  const columns = [
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Time", dataIndex: "slot", key: "slot" },
    { title: "Doctor", dataIndex: "doctorName", key: "doctorName" },
    { title: "Patient", dataIndex: "userName", key: "userName" },
    { title: "Booked At", dataIndex: "bookedOn", key: "bookedOn" },
    { title: "Problem", dataIndex: "problem", key: "problem" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <span
            style={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={() => confirmDelete(record.id)}
          >
            Delete
          </span>
          <span
            style={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={() => {
              setSelectedAppointment(record);
              setIsModalVisible(true);
            }}
          >
            Reschedule
          </span>
        </div>
      ),
    },
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

export default AppointmentsList;
