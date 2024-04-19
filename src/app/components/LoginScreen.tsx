import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { IUser, signInEndpoint } from "../backend";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
    error: {
        backgroundColor: "rgb(253, 236, 234)",
        borderRadius: "5px",
        padding: "16px",
        margin: "16px 0"
    }
})

interface ILoginScreenProps {
    onSignIn: (user: IUser) => void;
}

export function LoginScreen(props: ILoginScreenProps){

    const classes = useStyles();

    const [email, setEmail] = useState("danilo@email.com");
    const [password, setPassword] = useState("1234");
    const [error, setError] = useState("");

    function signIn(e: React.FormEvent){
        e.preventDefault();

        signInEndpoint(email, password).then(props.onSignIn, error => {
            setError("Email not found or password incorrect");
            console.error(error)
        })
      }

    return (
        <>
            <Container maxWidth="sm">
                <h1>Agenda React</h1>
                <Typography my={3} component="p">Digite e-mail e senha para entrar no sistema.</Typography>
                <form onSubmit={signIn}>
                    <TextField
                        type="email"
                        margin="normal"
                        label="Email:"
                        value={email}
                        onChange={(evt) => setEmail(evt.target.value)}
                        fullWidth
                    />
                    <TextField
                        type="password"
                        margin="normal"
                        label="Senha:"
                        value={password}
                        onChange={(evt) => setPassword(evt.target.value)}
                        fullWidth
                    />
                    {error && (
                        <Box className={classes.error}>{error}</Box>
                    )}
                    <Box>
                        <Button variant="contained" color="primary" type="submit" fullWidth>LOGIN</Button>
                    </Box>
                </form>

            </Container>
        </>
    )
}