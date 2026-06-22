import io from "socket.io-client";

const server_url = "http://localhost:8000";

export const connectSocket = () => {

    return io.connect(server_url, {
        secure: false
    });

};