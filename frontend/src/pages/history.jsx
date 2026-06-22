import React, { useState, useContext,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../contexts/AuthContext'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';

import CardActions from '@mui/material/CardActions';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { IconButton } from "@mui/material";
import HomeIcon from  "@mui/icons-material/Home"


export default function History() {

    const {getHistoryOfUser} =  useContext(AuthContext);

    const [meetings,setMeetings] = useState([]);

    const routeTo = useNavigate();
    useEffect(()=>{
          const fetchHistory = async()=>{
            try{
                const history = await getHistoryOfUser();
                setMeetings(history);
            }catch{}
          }
          fetchHistory();
    },[]);

    let formatDate = (dateString) =>{
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2,"0");
      const month = (date.getMonth()+1).toString().padStart(2,"0");
      const year = date.getFullYear();

      return `${day}/${month}/${year}`
    }
 return (
  <Box
    sx={{
      minHeight: "100vh",
      background: "#020617",
      color: "white",
      padding: "30px"
    }}
  >

    {/* TOP BAR */}

    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "30px"
      }}
    >
      <IconButton
        onClick={() => {
          routeTo("/home");
        }}
        sx={{
          color: "#a855f7",
          background: "#111827",
          "&:hover": {
            background: "#1e293b"
          }
        }}
      >
        <HomeIcon />
      </IconButton>

      <Typography variant="h4" fontWeight="bold">
        Meeting History
      </Typography>
    </Box>

    {/* HISTORY CARDS */}

    <Box
  sx={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
    gap: "20px"
  }}
>
      {meetings.map((e, i) => {
        return (
          <Card
            key={i}
            sx={{
              background: "#111827",
              color: "white",
              border: "1px solid #7c3aed",
              borderRadius: "15px",
              transition: "0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 0 20px rgba(168,85,247,0.5)"
              }
            }}
          >
            <CardContent>

              <Typography
                variant="h6"
                sx={{
                  color: "#c084fc",
                  marginBottom: "10px"
                }}
              >
                Meeting Code: {e.meetingCode}
              </Typography>

              <Typography
                sx={{
                  color: "#d1d5db"
                }}
              >
                Date: {formatDate(e.date)}
              </Typography>

            </CardContent>
          </Card>
        );
      })}
    </Box>
  </Box>
);
}
