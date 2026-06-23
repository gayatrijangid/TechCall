
import React, { useEffect, useRef, useState } from 'react'
// import io from "socket.io-client";
import { connectSocket } from "../services/socketService";
import { Badge, IconButton, TextField } from '@mui/material';
import { Button } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import styles from "../styles/videoComponent.module.css";
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import ChatIcon from '@mui/icons-material/Chat'
import axios from "axios";
import CodeEditor from '../components/CodeEditor';
import VideoSection from "../components/VideoSection";
import ChatBox from "../components/ChatBox";
import { useNavigate } from "react-router-dom";
import {
    peerConfigConnections,
    black,
    silence
} from "../services/webRTCService";
import server from '../environment';



var connections = {};


export default function VideoMeetComponent() {

    var socketRef = useRef();//socket ko store karne kel liye permanent
    let socketIdRef = useRef();

    let localVideoref = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);

    let [audioAvailable, setAudioAvailable] = useState(true);

    let [video, setVideo] = useState(false);

    let [audio, setAudio] = useState();

    let [screen, setScreen] = useState();

    let [showModal, setModal] = useState(true);

    let [screenAvailable, setScreenAvailable] = useState();

    let [messages, setMessages] = useState([])

    let [message, setMessage] = useState("");

    let [newMessages, setNewMessages] = useState(3);

    let [askForUsername, setAskForUsername] = useState(true);

    let [username, setUsername] = useState("");

    const videoRef = useRef([])//multiple video store

    let [videos, setVideos] = useState([])
    const [code, setCode] = useState("// Start Coding...");
    const [showEditor, setShowEditor] = useState(false);
    const [language, setLanguage] = useState("javascript");
    const [output, setOutput] = useState("");

    useEffect(() => {
        getPermissions();

    },[])
    

    let getDislayMedia = () => {//screen share
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }

    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoPermission) {
                setVideoAvailable(true);
                console.log('Video permission granted');
            } else {
                setVideoAvailable(false);
                console.log('Video permission denied');
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (audioPermission) {
                setAudioAvailable(true);
                console.log('Audio permission granted');
            } else {
                setAudioAvailable(false);
                console.log('Audio permission denied');
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoref.current) {
                        localVideoref.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
            console.log("SET STATE HAS ", video, audio);

        }


    }, [video, audio])
    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();

    }




    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)//users can see our video

            connections[id].createOffer().then((description) => {//sending invitaion
                
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            for (let id in connections) {
                connections[id].addStream(window.localStream)

                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                        })
                        .catch(e => console.log(e))
                })
            }
        })
    }

    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .then((stream) => { })
                .catch((e) => console.log(e))
        } else {
            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) {
                console.log(e);
            }
        }
    }





    let getDislayMediaSuccess = (stream) => {
       

        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            getUserMedia()

        })
    }

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }




    let connectToSocketServer = () => {
       socketRef.current = connectSocket();
        socketRef.current.on("connect", () => {

            console.log(
                "socket connected",
                socketRef.current.id
            );

        });

        socketRef.current.on(
            "code-change",
            (newCode) => {

                setCode(newCode);

            }
        );


        socketRef.current.on('signal', gotMessageFromServer)

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', window.location.href)
            socketIdRef.current = socketRef.current.id

            socketRef.current.on('chat-message', addMessage)

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
            })

            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {

                    // connections[socketListId] = new RTCPeerConnection(peerConfigConnections)

                    if (!connections[socketListId]) {
    connections[socketListId] = new RTCPeerConnection(peerConfigConnections);
}
                    // Wait for their ice candidate       
                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }

                    // Wait for their video stream
                    connections[socketListId].onaddstream = (event) => {

                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);

                        if (videoExists) {
                            console.log("FOUND EXISTING");

                            // Update the stream of the existing video
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            // Create a new video
                            
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsinline: true
                            };

                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }

                    };


                    // Add the local video stream
                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream)
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()])
                        window.localStream = blackSilence()
                        connections[socketListId].addStream(window.localStream)
                    }
                })

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue

                        try {
                            connections[id2].addStream(window.localStream)
                        } catch (e) { }
console.log(
    id2,
    connections[id2].signalingState
);
                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
                                })
                                .catch(e => console.log(e))
                        })
                    }
                }
            })
        })
    }


    let handleVideo = () => {
        setVideo(!video);
        // getUserMedia();
    }
    let handleAudio = () => {
        setAudio(!audio)
        // getUserMedia();
    }

    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
    }, [screen])
    let handleScreen = () => {
        setScreen(!screen);
    }
    const navigate = useNavigate();
    let handleEndCall = () => {

    try {

        let tracks = localVideoref.current.srcObject.getTracks()

        tracks.forEach(track => track.stop())

    } catch (e) {
        console.log(e)
    }

    for(let id in connections){

        connections[id].close();

    }

    if(socketRef.current){

        socketRef.current.disconnect();

    }

    navigate("/home");
}

    let openChat = () => {
        setModal(true);
        setNewMessages(0);
    }
    let closeChat = () => {
        setModal(false);
    }
    let handleMessage = (e) => {
        setMessage(e.target.value);
    }

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };



    let sendMessage = () => {
        console.log(socketRef.current);
        socketRef.current.emit('chat-message', message, username)
        setMessage("");

        // this.setState({ message: "", sender: username })
    }


    let connect = () => {
        setAskForUsername(false);
        getMedia();
    }
    const runCode = async () => {

        try {

            setOutput("Running...");

            const response = await axios.post(

               ` ${server}/run`,

                {
                    code
                }
            );

            setOutput(
                response.data.output
            );

        }
        catch (error) {

            console.log(error);

            setOutput(
                "Error running code"
            );

        }

    }
    return (
        <div>

            {
                askForUsername === true ?

                    <div className={styles.lobbyContainer}>

                        <h2>Enter into Lobby</h2>


                        <TextField
  label="Username"
  variant="outlined"
  value={username}
  onChange={(e)=>setUsername(e.target.value)}

  sx={{
    width:"300px",
    
    input:{ color:"white" },

    label:{ color:"gray" },

    "& fieldset":{
      borderColor:"gray"
    }
  }}
/>

                        <Button
                            variant="contained"
                            onClick={connect}
                             style={{ background: "#7c3aed" }}
                        >
                            Connect
                        </Button>

                        <video
                            ref={localVideoref}
                            autoPlay
                            muted
                            className={styles.lobbyVideo}
                        ></video>

                    </div>

                    :

                    <div className={styles.meetVideoContainer}>

                        {/* LEFT VIDEO SECTION */}



                        <VideoSection

                            localVideoref={localVideoref}

                            videos={videos}
                            

                        />

                        {/* RIGHT SECTION */}

                        <div className={styles.rightSection}>

                            {/* CHAT */}
                            {
                                showModal && (

                                    <ChatBox

                                        messages={messages}

                                        message={message}

                                        setMessage={setMessage}

                                        sendMessage={sendMessage}

                                    />

                                )
                            }

                            {/* EDITOR */}

                            {
                                showEditor && (

                                    <div className={styles.editorContainer}>

                                        <div className={styles.editorHeader}>

                                            <h2>Live Coding Interview</h2>

                                            <select
                                                value={language}
                                                onChange={(e) => setLanguage(e.target.value)}
                                            >
                                                <option value="javascript">JavaScript</option>
                                                <option value="python">Python</option>
                                                <option value="java">Java</option>
                                                <option value="cpp">C++</option>
                                            </select>

                                        </div>

                                        <CodeEditor
                                            code={code}
                                            setCode={setCode}
                                            socketRef={socketRef}
                                            runCode={runCode}
                                            output={output}
                                        />


                                    </div>

                                )
                            }

                        </div>

                        {/* BOTTOM BUTTONS */}

                        <div className={styles.buttonContainers}>

                            <IconButton
                                onClick={handleVideo}
                                style={{ color: "white" }}
                            >
                                {
                                    video === true
                                        ? <VideocamIcon />
                                        : <VideocamOffIcon />
                                }
                            </IconButton>

                            <IconButton
                                onClick={handleEndCall}
                                style={{ color: "red" }}
                            >
                                <CallEndIcon />
                            </IconButton>

                            <IconButton
                                onClick={handleAudio}
                                style={{ color: "white" }}
                            >
                                {
                                    audio === true
                                        ? <MicIcon />
                                        : <MicOffIcon />
                                }
                            </IconButton>

                            {
                                screenAvailable === true &&

                                <IconButton
                                    onClick={handleScreen}
                                    style={{ color: "white" }}
                                >
                                    {
                                        screen === true
                                            ? <ScreenShareIcon />
                                            : <StopScreenShareIcon />
                                    }
                                </IconButton>
                            }

                            <Badge
                                badgeContent={newMessages}
                                color='error'
                            >
                                <IconButton
                                    onClick={() => setModal(!showModal)}
                                    style={{ color: "white" }}
                                >
                                    <ChatIcon />
                                </IconButton>
                            </Badge>

                            <Button
                                variant="contained"
                                onClick={() => setShowEditor(!showEditor)}
                                style={{ background: "#7c3aed" }}
                            >  
                                {
                                    showEditor
                                        ? "Close Editor"
                                        : "Open Editor"
                                }
                            </Button>

                        </div>

                    </div>
            }

        </div>
    )
}



