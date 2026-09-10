import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const handleLogin = async () => {

        setErrorMessage("");

        try {
            await axios.post(
                "http://localhost:3000/api/login",
                {
                    username: username,
                    password: password
                },
                {
                    withCredentials: true
                }
            );

            navigate("/articles");

        } catch (error) {

            setErrorMessage(error.response.data.message);
        }
    };

    return (
        <div>
            <h1>Login</h1>

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            />

            {errorMessage && <p>{errorMessage}</p>}

            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Login;