import React, { useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
// import "../App.css"
import "../styles/home.css"
import { Button, IconButton, TextField } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore'
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
 function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode,setMeetingCode] = useState("");
    // const {addToUserHistory} = useContext(AuthContext);

    
    const {addToUserHistory} = useContext(AuthContext);
    let handleJoinVideo = async () =>{ 
        await addToUserHistory(meetingCode)
       navigate(`/${meetingCode }`)
    }
  return (
    <>
    <div className='navBar'>
        <div className='joinBox'>

            <h3>TechCall</h3>
        </div>
        <div style={{display:'flex',alignItems:"center"}}>
        <IconButton onClick={()=>{
            navigate("/history")
        }}>
            <RestoreIcon/>
        </IconButton>
        <p>History</p>
        <Button className='logout' onClick={()=>{
            localStorage.removeItem("token")
            navigate("/auth")
        }}>
            Logout
        </Button>
        </div>
    </div>
    <div className='meetContainer'>
          <div className='leftPanel'>
            <div>
                <h2>Providing Quality Video call just like Quiality Education</h2>
                 <div className='joinBox'>

                    <TextField  className="meetingInput" onChange={e => setMeetingCode(e.target.value)} id='outlined-basic' label="Meeting Code" variant = "outlined"/>
                    <Button className="joinBtn" onClick={handleJoinVideo} variant='contained'>Join</Button>
          </div>
          </div>
    </div>
        <div className='rightPanel'>
            <img srcSet='/auth2.jpg' alt="" />
        </div>
        </div>
        </>
  )
  }
export default withAuth(HomeComponent)