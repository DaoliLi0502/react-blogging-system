import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Navbar() {

    const [user, setUser] = useState(null);

    useEffect(() => {

        const fetchCurrentUser = async () => {

            try {

                const response = await axios.get(
                    "http://localhost:3000/api/users/me",
                    {
                        withCredentials: true
                    }
                );

                setUser(response.data.user);

            } catch (error) {

                setUser(null);
            }
        };

        fetchCurrentUser();

    }, []);

    if (!user) {

        return (
            <nav>
                <Link to="/articles">
                    Articles
                </Link>

                <Link to="/search">
                    Search
                </Link>

                <Link to="/login">
                    Create Article
                </Link>

                <Link to="/login">
                    Notifications
                </Link>

                <Link to="/login">
                    My Profile
                </Link>

                <Link to="/login">
                    Login
                </Link>
            </nav>
        );
    }

    return (
        <nav>
            <Link to="/articles">
                Articles
            </Link>

            <Link to="/articles/create">
                Create Article
            </Link>

            <Link to="/notifications">
                Notifications
            </Link>

            <Link to="/profile">
                My Profile
            </Link>

            <Link to="/search">
                Search
            </Link>
        </nav>
    );
}

export default Navbar;