import React, { useEffect } from "react";
import { Col, Form, Row, message } from "antd";
import Item from "antd/es/list/Item";
import { useDispatch } from "react-redux";
import { AddDoctor, CheckIfDoctorAccountIsApplied, GetDoctorById } from "../../apicalls/doctors";
import { ShowLoader } from "../../redux/loaderSlice";
import { useNavigate } from "react-router-dom";

function DoctorForm() {
    const [days , setDays] = React.useState([]);
    const [alreadyApplied , setAlreadyApplied] = React.useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onFinish = async(values) => {
        try {
            dispatch(ShowLoader(true));
            const payload = {
                ...values,
                days,
                userId : JSON.parse(localStorage.getItem("user")).id,
                status : "pending"
            };
            const response = await AddDoctor(payload);
            if (response.success) {
                message.success(response.message);
                navigate("/profile")


            } else {
                message.error(response.message);
            }
            dispatch(ShowLoader(false));

        } catch (error) {
            dispatch(ShowLoader(false));
            message.error(error.message);
            
        }
    };

    const checkIfAlreadyApplied = async () => {
        try {
          dispatch(ShowLoader(true));
          const response = await CheckIfDoctorAccountIsApplied(JSON.parse(localStorage.getItem("user")).id);
          if(response.success) {
            setAlreadyApplied(true);
          }
          dispatch(ShowLoader(false));
        } catch (error) {
          dispatch(ShowLoader(false));
          message.error(error.message);
        }
      };
      


    useEffect(() => {
        checkIfAlreadyApplied();
    }, []);
    return (
        <div className="bg-white p-2">

            {!alreadyApplied && <><h3 className="uppercase my-1" >Register as a doctor</h3>
            <hr />

            <Form layout="vertical" className="my-1"
            onFinish={onFinish}
            >

                <Row
                    gutter={[16, 16]}
                >
                    {/* personal information */}

                    <Col span={24}>
                    <h4 className="uppercase"><b>Personal information</b></h4>
                    </Col>

                    <Col span={8}>
                        <Form.Item label="First Name" name="firstName"
                            rules={[
                                {
                                    required: true,
                                    message: "Required!",
                                },


                            ]}
                        >
                            <input type="text" />

                        </Form.Item>
                    </Col>
                    <Col span={8}>

                        <Form.Item label="Last Name" name="lastName"
                            rules={[
                                {
                                    required: true,
                                    message: "Required!",
                                },


                            ]}
                        >
                            <input type="text" />

                        </Form.Item>
                    </Col>

                    <Col span={8}>

                        <Form.Item label="Email Address" name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Required!",
                                },


                            ]}
                        >
                            <input type="email" />

                        </Form.Item>

                    </Col>
                    <Col span={8}>

                        <Form.Item label="Phone No." name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: "Required!",
                                },


                            ]}
                        >
                            <input type="number" />

                        </Form.Item>

                    </Col>
                    <Col span={8}>

                        <Form.Item label="Website" name="website"
                            rules={[
                                {
                                    required: true,
                                    message: "Required!",
                                },


                            ]}
                        >
                            <input type="text" />

                        </Form.Item>

                    </Col>

                    <Col span={24}>

                        <Form.Item label="Clinic" name="address"
                            rules={[
                                {
                                    required: true,
                                    message: "Required!",
                                },


                            ]}
                        >
                            <textarea type="text" />

                        </Form.Item>

                    </Col>

                    <Col span={24}>
                    <hr />
                    </Col>

                    <Col span={24}>
                    <h4 className="uppercase"><b>Professional information</b></h4>
                    </Col>

                    {/* professional information */}

                    <Col span={8}>

                        <Form.Item label="Specialization" name="specialty"
                            rules={[
                                {
                                    required: true,
                                    message: "Required!",
                                },


                            ]}
                        >
                            <select>
                                <option value="pediatrician">Pediatrician</option>
                                <option value="familymedicine">Family Medicine</option>

                            </select>


                        </Form.Item>

                    </Col>

                    

                    <Col span={8}>

                        <Form.Item label="Years of Experience" name="experience"
                            rules={[
                                {
                                    required: true,
                                    message: "Required!",
                                },


                            ]}
                        >
                            <input type="number" />

                        </Form.Item>

                    </Col>

                    <Col span={8}>

                        <Form.Item label="Language" name="language"
                            rules={[
                                {
                                    required: true,
                                    message: "Required!",
                                },


                            ]}
                        >
                            <select>
                                <option value="english">English</option>
                                <option value="filipino">Filipino</option>
                                <option value="hindi">Hindi</option>

                            </select>


                        </Form.Item>

                    </Col>

                    <Col span={24}>
                    <hr />
                    </Col>

                    <Col span={24}>
                    <h4 className="uppercase"><b>Work Hours</b></h4>
                    </Col>
                    {/* work hours */}

                    <Col span={8}>

                        <Form.Item label="Start Time" name="startTime"
                            rules={[
                                {
                                    required: true,
                                    message: "Required!",
                                },


                            ]}
                        >
                            <input type="time" />

                        </Form.Item>

                    </Col>

                    <Col span={8}>

                        <Form.Item label="End Time" name="endTime"
                            rules={[
                                {
                                    required: true,
                                    message: "Required!",
                                },


                            ]}
                        >
                            <input type="time" />

                        </Form.Item>

                    </Col>

                    <Col span={8}>

                        <Form.Item label="Fee" name="fee"
                            rules={[
                                {
                                    required: true,
                                    message: "Required!",
                                },


                            ]}
                        >
                            <input type="number" />

                        </Form.Item>

                    </Col>

                    <Col span={24}>

                       <div className="flex gap-2">
                       {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                            <div className="flex items-center">
                                <input type="checkbox" key={index} value={day}
                                onChange={(e)=>{
                                    if(e.target.checked){
                                        setDays([...days, e.target.value])
                                    }else{
                                        setDays(days.filter((Item) =>Item !== e.target.value));
                                    }
                                }}
                                />
                                <label>{day}</label>
                                </div>
                        )
                    )}

                       </div>

                    </Col>

                </Row>

                <div className="flex justify-end gap-2">
                <button className="outlined-btn"
                type="button"
                >
                    CANCEL

                    </button>
                    <button className="contained-btn"
                    type="submit"
                    >
                    SUBMIT

                    </button>

                </div>

            </Form></>}
            {alreadyApplied && 
            <div className="flex flex-col items-center gap-2">
                <h3 className="text-secondary">You have already applied for this account, please wait for admin to approve your request</h3>
                </div>
            }
            
            

            
            

        </div>
    )
}

export default DoctorForm  