import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ArticleCard from "../components/ArticleCard";
import "./Profile.css";

function Profile() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [articles, setArticles] = useState([]);
    const [avatars, setAvatars] = useState([]);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [realName, setRealName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [description, setDescription] = useState("");
    const [avatarId, setAvatarId] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

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

            if (error.response.status === 401) {

                navigate("/login");

                return;
            }

            setErrorMessage(error.response.data.message);
        }
    };

    const fetchMyArticles = async () => {

        try {

            const response = await axios.get(
                "http://localhost:3000/api/articles/me",
                {
                    params: {
                        page,
                        limit: 10
                    },
                    withCredentials: true
                }
            );

            setArticles(response.data.articles);
            setTotalPages(response.data.pagination.totalPages);

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

    useEffect(() => {

        fetchProfile();
        fetchMyArticles();
        fetchAvatars();

    }, [page]);

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

            await fetchProfile();

            setSuccessMessage(response.data.message);

        } catch (error) {

            setErrorMessage(error.response.data.message);
        }
    };

    const handleLogout = async () => {

        try {

            await axios.post(
                "http://localhost:3000/api/logout",
                {},
                {
                    withCredentials: true
                }
            );

            navigate("/articles");

        } catch (error) {

            setErrorMessage(error.response.data.message);
        }
    };

    if (!user) {

        return <p>Loading...</p>;
    }

    return (
        <div className="page profile-page">
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

            <form className="profile-form" onSubmit={handleUpdateProfile}>

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
                    Update Profile
                </button>

            </form>

            <hr />

            <h2>My Articles</h2>

            {articles.length === 0 && (
                <p>You have not created any articles yet.</p>
            )}

            {articles.map((article) => (
                <ArticleCard
                    key={article.article_id}
                    article={article}
                />
            ))}

            <div className="pagination">
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                >
                    Previous
                </button>

                <span>
                    Page {page} of {totalPages}
                </span>

                <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                >
                    Next
                </button>
            </div>

            <button onClick={() => navigate("/articles")}>
                Back to Articles
            </button>

            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}

export default Profile;
