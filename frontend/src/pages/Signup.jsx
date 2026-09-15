import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [realName, setRealName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [description, setDescription] = useState("");
    const [avatarId, setAvatarId] = useState("");

    const [avatars, setAvatars] = useState([]);

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const fetchAvatars = async () => {

        try {

            const response = await axios.get(
                "http://localhost:3000/api/avatars"
            );

            setAvatars(response.data.avatars);

        } catch (error) {

            setErrorMessage(error.response.data.message);
        }
    };

    useEffect(() => {

        fetchAvatars();

    }, []);

    const handleSignup = async (event) => {

        event.preventDefault();

        setErrorMessage("");
        setSuccessMessage("");

        try {

            const response = await axios.post(
                "http://localhost:3000/api/users",
                {
                    username,
                    password,
                    real_name: realName,
                    date_of_birth: dateOfBirth,
                    description,
                    avatar_id: avatarId
                        ? Number(avatarId)
                        : null
                }
            );

            setSuccessMessage(response.data.message);

            navigate("/login");

        } catch (error) {

            setErrorMessage(error.response.data.message);
        }
    };

    return (
        <div>
            <h1>Sign Up</h1>

            {errorMessage && (
                <p>{errorMessage}</p>
            )}

            {successMessage && (
                <p>{successMessage}</p>
            )}

            <form onSubmit={handleSignup}>

                <div>
                    <label>
                        Username:

                        <input
                            type="text"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            required
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Password:

                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Real Name:

                        <input
                            type="text"
                            value={realName}
                            onChange={(event) => setRealName(event.target.value)}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Date of Birth:

                        <input
                            type="date"
                            value={dateOfBirth}
                            onChange={(event) => setDateOfBirth(event.target.value)}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Description:

                        <textarea
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                        />
                    </label>
                </div>

                <div>
                    <p>Select Avatar:</p>

                    <label>
                        <input
                            type="radio"
                            name="avatar"
                            value=""
                            checked={avatarId === ""}
                            onChange={(event) => setAvatarId(event.target.value)}
                        />

                        No avatar
                    </label>

                    {avatars.map((avatar) => (
                        <label key={avatar.avatar_id}>
                            <input
                                type="radio"
                                name="avatar"
                                value={String(avatar.avatar_id)}
                                checked={
                                    avatarId === String(avatar.avatar_id)
                                }
                                onChange={(event) => setAvatarId(event.target.value)}
                            />

                            <img
                                src={`http://localhost:3000${avatar.image_path}`}
                                alt="Avatar"
                                width="80"
                            />
                        </label>
                    ))}
                </div>

                <button type="submit">
                    Sign Up
                </button>

            </form>

            <button onClick={() => navigate("/login")}>
                Back to Login
            </button>
        </div>
    );
}

export default Signup;