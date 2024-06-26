import React from 'react'
import { Tabs } from 'antd'
import Userslist from './UsersList'
import Doctorslist from './Doctorslist'

function Admin() {
    return (
        <div className="bg-white p-1">
                 <Tabs>
            <Tabs.TabPane tab="Users" key="1">
                <Userslist />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Doctors" key="2">
                <Doctorslist />
            </Tabs.TabPane>
        </Tabs>
        </div>   
    )
}

export default Admin