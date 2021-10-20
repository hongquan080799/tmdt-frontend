import React from 'react'
import Login from '../../components/Login'
import {getLogin} from '../../api/UserApi'
export default function index() {
    return (
        <div>
            <Login />
        </div>
    )
}
