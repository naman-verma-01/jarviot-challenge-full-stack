import React, { useEffect } from 'react'
import {useParams, useNavigate } from 'react-router-dom'


function Redirect() {

    const { gId } = useParams()
    const navigate = useNavigate()

    const redirect = async() =>{
        localStorage.setItem('gId', gId)
        navigate('/dashboard')
    }

    useEffect(()=>{

        redirect()
    },[])

    return (
        <div>Redirect</div>
    )
}

export default Redirect