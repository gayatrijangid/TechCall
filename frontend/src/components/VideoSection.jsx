import React from "react";
import styles from "../styles/videoComponent.module.css";

const VideoSection = ({
    localVideoref,
    videos,

}) => {

    return (

        <div className={styles.videoSection}>
<h2 className={styles.roomTitle}>
   TechCall Meeting Room
</h2>
            {/* MY VIDEO */}

            <video
                className={styles.meetUserVideo}
                ref={localVideoref}
                autoPlay
                muted
                
            ></video>
           
            

            {/* REMOTE VIDEOS */}

            <div className={styles.conferenceView}>

                {
                    videos.map((video) => (

                        <div key={video.socketId}>

                            <video
                                data-socket={video.socketId}
                                ref={ref => {

                                    if (ref && video.stream) {

                                        ref.srcObject =
                                            video.stream;

                                    }

                                }}

                                autoPlay

                                className={
                                    styles.remoteVideo
                                }
          
                            >
                            </video>
                            


                        </div>

                    ))
                }

            </div>

        </div>

    );

}

export default React.memo(VideoSection);