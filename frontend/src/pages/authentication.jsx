
import * as React from 'react';

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import "../styles/new.css";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar } from '@mui/material';

const defaultTheme = createTheme();

export default function Authentication() {

    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [name, setName] = React.useState("");
    const [error, setError] = React.useState("");
    const [message, setMessage] = React.useState("");

    const [formState, setFormState] = React.useState(0);
    const [open, setOpen] = React.useState(false);

    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    let handleAuth = async () => {
        try {

            if (formState === 0) {

                let result = await handleLogin(username,password);
                console.log(result);

            }

            if (formState === 1) {

                let result = await handleRegister(name, username, password);

                console.log(result);

                setUsername("");
                setPassword("");
                setMessage(result);
                setOpen(true);
                setError("");
                setFormState(0);
            }

        } catch (err) {

            console.log(err);

            let message = err.response.data.message;

            setError(message);
        }
    }

    return (

        <ThemeProvider theme={defaultTheme}>

            <Grid
                container
                component="main"
                className="authContainer"
            >

                <CssBaseline />

                <Grid
                    xs={12}
                    sm={8}
                    md={4}
                    component={Paper}
                    elevation={6}
                    className="authCard"
                >

                    <Box className="authBox">

                        <h1 className="authTitle">
                            TechCall
                        </h1>

                        <p className="authSubtitle">
                            Live Coding Interview Platform
                        </p>

                        <div className="switchButtons">

                            <Button
                                variant={formState === 0 ? "contained" : "outlined"}
                                onClick={() => setFormState(0)}
                            >
                                Sign In
                            </Button>

                            <Button
                                variant={formState === 1 ? "contained" : "outlined"}
                                onClick={() => setFormState(1)}
                            >
                                Sign Up
                            </Button>

                        </div>

                        <Box
                            component="form"
                            noValidate
                            className="authForm"
                        >

                            {
                                formState === 1 &&

                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            }

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <p className="errorText">
                                {error}
                            </p>

                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                className="submitBtn"
                                onClick={handleAuth}
                            >
                                {
                                    formState === 0
                                        ? "Login"
                                        : "Register"
                                }
                            </Button>

                        </Box>

                    </Box>

                </Grid>

            </Grid>

            <Snackbar
                open={open}
                autoHideDuration={4000}
                message={message}
            />

        </ThemeProvider>
    );
}
