import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { ShowLoader } from '../../redux/loaderSlice'
import { Table, message } from 'antd'
import { GetAllDoctors } from '../../apicalls/doctors'


function DoctorsList() {
  const [doctors, setDoctors] = React.useState([])

  const dispatch = useDispatch()
  const getData = async () => {
try {

    dispatch(ShowLoader(true))
    const response = await GetAllDoctors()
    dispatch(ShowLoader(false))
    if (response.success) {
        setDoctors(response.data)
    } else {
        throw new Error(response.message)
    }
    
} catch (error) {
    dispatch(ShowLoader(false))
    message.error(error.message)
    
}

    try {
      
    } catch (error) {
      
    }
  }

  useEffect(() => {
    getData()
  }, [])


const columns = [
    {
        title: "First Name",
        dataIndex: "firstName",
      },
      {
        title: "Last Name",
        dataIndex: "LastNAme",
      },
      {
        title: "Email",
        dataIndex: "email",
      },
      {
        title: "Phone",
        dataIndex: "phone",
      },
      {
        title: "Specialty",
        dataIndex: "specialty",
      },
      {
        title: "Status",
        dataIndex: "status",
      },

]
  return (
    <div><Table columns={columns} dataSource={doctors} /></div>
  );
}

export default DoctorsList
