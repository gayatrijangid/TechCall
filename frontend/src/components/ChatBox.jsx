import React from "react";
import { TextField, Button } from "@mui/material";
import styles from "../styles/videoComponent.module.css";

const ChatBox = ({
    messages,
    message,
    setMessage,
    sendMessage
}) => {

    return (

        <div className={styles.chatRoom}>

            <h1>Chat</h1>

            <div className={styles.chattingDisplay}>

                {
                    messages.length !== 0 ?

                        messages.map((item, index) => (

                            <div
                                key={index}
                                className={styles.messageBox}
                            >

                                <p>
                                    <b>{item.sender}</b>
                                </p>

                                <p>
                                    {item.data}
                                </p>

                            </div>

                        ))

                        :

                        <p>No Messages Yet</p>
                }

            </div>

            <div className={styles.chattingArea}>

                <TextField
                    value={message}
                    onChange={(e) =>
                        setMessage(e.target.value)
                    }
                    label="Enter Your Chat"
                    variant="outlined"
                    fullWidth
                    
                />

                <Button
                    variant="contained"
                    onClick={sendMessage}
                    style={{ background: "#7c3aed" }}
                >
                    Send
                </Button>

            </div>

        </div>

    );

}

export default React.memo(ChatBox);