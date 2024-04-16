import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";

export function LoginScreen(){

    const [email, setEmail] = useState("danilo@email.com");
    const [password, setPassword] = useState("1234");

    function signIn(e: React.FormEvent){
        e.preventDefault();

        console.log("teste")

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
                    <Box>
                        <Button variant="contained" color="primary" type="submit" fullWidth>LOGIN</Button>
                    </Box>
                </form>

            </Container>
        </>
    )
}