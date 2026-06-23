import io from "socket.io-client";
import server from "../environment"

const server_url = server;

export const connectSocket = () => {

    return io.connect(server_url, {
        secure: false
        
    });

};