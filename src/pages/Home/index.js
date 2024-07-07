import { Col, message, Row } from "antd";
import React, { useEffect } from "react";
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
  const [doctors = [], setDoctors] = React.useState([]);
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

  return (
    user && (
      <div className="flex flex-col justify-between h-screen">
        
        <div className="flex-grow">
          <div className="flex justify-between">
            <div>
              <input placeholder="Search doctors" className="w-400" />
            </div>
            {user?.role !== "doctor" && (
              <button
                className="outlined-btn"
                onClick={() => navigate("/apply-doctor")}
              >
                Register as a Doctor
              </button>
            )}
          </div>
          <Row gutter={[16, 16]} className="my-1">
            {doctors.map((doctor) => (
              <Col span={8} key={doctor.id}>
                <div
                  className="bg-white p-1 flex flex-col gap-1 cursor-pointer"
                  onClick={() => navigate(`/book-appointment/${doctor.id}`)}
                >
                  <div className="flex justify-between w-full">
                    <h2 className="uppercase">
                      {doctor.firstName} {doctor.lastName}
                    </h2>
                  </div>
                  <hr />
                  <div className="flex justify-between w-full">
                    <h4>
                      <b>Speciality : </b>
                    </h4>
                    <h4>{doctor.speciality}</h4>
                  </div>
                  <div className="flex justify-between w-full">
                    <h4>
                      <b>Experience : </b>
                    </h4>
                    <h4>
                      {doctor.experience}
                      Years
                    </h4>
                  </div>
                  <div className="flex justify-between w-full">
                    <h4>
                      <b>Email : </b>
                    </h4>
                    <h4>{doctor.email}</h4>
                  </div>
                  <div className="flex justify-between w-full">
                    <h4>
                      <b>Phone : </b>
                    </h4>
                    <h4>{doctor.phone}</h4>
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
