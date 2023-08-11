import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Logout() {

    const navigate = useNavigate()
    const logout = async () =>{

        await fetch(`http://localhost:3000/fetchFiles?gId=${localStorage.getItem('gId')}`)

        localStorage.removeItem('gId')
        navigate('/login')
    }

    useEffect(()=>{
        logout()
    },[])
  return (
    <div>Loging Out...</div>
  )
}

export default Logout