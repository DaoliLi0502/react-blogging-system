import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Profile() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [articles, setArticles] = useState([]);
    const [avatars, setAvatars] = useState([]);

    const [realName, setRealName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [description, setDescription] = useState("");
    const [avatarId, setAvatarId] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const response = await axios.get(
                    "http://localhost:3000/api/users/me",
                    {
                        withCredentials: true
                    }
                );

                const currentUser = response.data.user;

                setUser(currentUser);

                setRealName(currentUser.real_name || "");
                setDateOfBirth(currentUser.date_of_birth || "");
                setDescription(currentUser.description || "");
                setAvatarId(
                    currentUser.avatar_id
                        ? String(currentUser.avatar_id)
                        : ""
                );

            } catch (error) {

                setErrorMessage(error.response.data.message);
            }
        };

        const fetchMyArticles = async () => {

            try {

                const response = await axios.get(
                    "http://localhost:3000/api/articles/me",
                    {
                        withCredentials: true
                    }
                );

                setArticles(response.data.articles);

            } catch (error) {

                setErrorMessage(error.response.data.message);
            }
        };

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

        fetchProfile();
        fetchMyArticles();
        fetchAvatars();

    }, []);

    const handleUpdateProfile = async (event) => {

        event.preventDefault();

        setErrorMessage("");
        setSuccessMessage("");

        try {

            const response = await axios.put(
                "http://localhost:3000/api/users/me",
                {
                    real_name: realName,
                    date_of_birth: dateOfBirth,
                    description: description,
                    avatar_id: avatarId
                        ? Number(avatarId)
                        : null
                },
                {
                    withCredentials: true
                }
            );

            setUser((currentUser) => ({
                ...currentUser,
                real_name: realName,
                date_of_birth: dateOfBirth,
                description: description,
                avatar_id: avatarId
                    ? Number(avatarId)
                    : null
            }));

            setSuccessMessage(response.data.message);

        } catch (error) {

            setErrorMessage(error.response.data.message);
        }
    };

    const getAvatarImageUrl = (imagePath) => {

        if (imagePath.startsWith("/")) {

            return `http://localhost:3000${imagePath}`;
        }

        return `http://localhost:3000/${imagePath}`;
    };

    if (!user) {

        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>My Profile</h1>

            {errorMessage && (
                <p>{errorMessage}</p>
            )}

            {successMessage && (
                <p>{successMessage}</p>
            )}

            <div>
                <p>
                    Username: {user.username}
                </p>
            </div>

            <form onSubmit={handleUpdateProfile}>

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
                                src={getAvatarImageUrl(avatar.image_path)}
                                alt="Avatar"
                                width="80"
                            />
                        </label>
                    ))}
                </div>

                <button type="submit">
                    Update Profile
                </button>

            </form>

            <hr />

            <h2>My Articles</h2>

            {articles.length === 0 && (
                <p>You have not created any articles yet.</p>
            )}

            {articles.map((article) => (
                <div key={article.article_id}>
                    <h3>
                        <Link to={`/articles/${article.article_id}`}>
                            {article.title}
                        </Link>
                    </h3>

                    <p>
                        {article.created_at}
                    </p>
                </div>
            ))}

            <button onClick={() => navigate("/articles")}>
                Back to Articles
            </button>
        </div>
    );
}

export default Profile;