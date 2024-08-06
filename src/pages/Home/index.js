import { Col, message, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetAllDoctors } from "../../apicalls/doctors";
import { ShowLoader } from "../../redux/loaderSlice";

// Footer component
const Footer = () => (
  <footer style={{ backgroundColor: '#004182', color: 'white', padding: '1rem', fontFamily: 'Roboto, sans-serif', textAlign: 'center' }}>
    <p style={{ color: 'white' }}>&copy; 2024 Finding Vancouver Doctor. All rights reserved.</p>
  </footer>
);

function Home() {
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const getData = async () => {
    try {
      dispatch(ShowLoader(true));
      const response = await GetAllDoctors();
      if (response.success) {
        setDoctors(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(ShowLoader(false));
    } catch (error) {
      message.error(error.message);
      dispatch(ShowLoader(false));
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const fullName = `${doctor.firstName} ${doctor.lastName}`.toLowerCase();
    const speciality = doctor.speciality?.toLowerCase() || '';
    const language = doctor.language?.toLowerCase() || '';
    const daysAvailable = doctor.days?.join(', ').toLowerCase() || '';
    const availableTime = `${doctor.startTime} - ${doctor.endTime}`.toLowerCase();

    return (
      fullName.includes(searchQuery) ||
      speciality.includes(searchQuery) ||
      language.includes(searchQuery) ||
      daysAvailable.includes(searchQuery) ||
      availableTime.includes(searchQuery)
    );
  });

  return (
    user && (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '100vh' }}>
        <div style={{ flexGrow: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
            <div>
              {user && (
                <button
                  style={{ border: '1px solid #004182', padding: '0.5rem 1rem', backgroundColor: 'transparent', cursor: 'pointer', marginBottom: '1rem' }}
                  onClick={() => navigate(user.role === "admin" ? "/admin" : "/profile")}
                >
                  My Dashboard
                </button>
              )}
              <input
                placeholder="Search doctors"
                style={{ width: '100%', maxWidth: '400px' }}
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            {user?.role !== "doctor" && user?.role !== "admin" && (
              <button
                style={{ border: '1px solid #004182', padding: '0.5rem 1rem', backgroundColor: 'transparent', cursor: 'pointer' }}
                onClick={() => navigate("/apply-doctor")}
              >
                Register as a Doctor
              </button>
            )}
          </div>
          <Row gutter={[16, 16]} style={{ margin: '1rem 0' }}>
            {filteredDoctors.map((doctor) => (
              <Col xs={24} sm={12} md={8} key={doctor.id}>
                <div
                  style={{ backgroundColor: 'white', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer' }}
                  onClick={() => navigate(`/book-appointment/${doctor.id}`)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <h2 style={{ textTransform: 'uppercase' }}>
                      {doctor.firstName} {doctor.lastName}
                    </h2>
                  </div>
                  <hr />
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <h4>
                      <b>Clinic : </b>
                    </h4>
                    <h4>{doctor.address}</h4>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <h4>
                      <b>Speciality : </b>
                    </h4>
                    <h4>{doctor.speciality}</h4>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <h4>
                      <b>Language : </b>
                    </h4>
                    <h4>{doctor.language}</h4>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <h4>
                      <b>Experience : </b>
                    </h4>
                    <h4>
                      {doctor.experience} Years
                    </h4>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <h4>
                      <b>Email : </b>
                    </h4>
                    <h4>{doctor.email}</h4>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <h4>
                      <b>Phone : </b>
                    </h4>
                    <h4>{doctor.phone}</h4>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <h4>
                      <b>Days Available : </b>
                    </h4>
                    <h4>{doctor.days.join(', ')}</h4>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <h4>
                      <b>Available Time : </b>
                    </h4>
                    <h4>{doctor.startTime} - {doctor.endTime}</h4>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
        <Footer />
      </div>
    )
  );
}

export default Home;
