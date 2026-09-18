import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";

function Navbar() {

    const location = useLocation();

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {

        const fetchAuthStatus = async () => {

            try {

                const response = await axios.get(
                    "http://localhost:3000/api/status",
                    {
                        withCredentials: true
                    }
                );

                setIsLoggedIn(response.data.authenticated);

            } catch (error) {

                setIsLoggedIn(false);
            }
        };

        fetchAuthStatus();

    }, [location.pathname]);

    if (!isLoggedIn) {

        return (
            <nav className="site-nav">
                <Link to="/articles">
                    Articles
                </Link>

                <Link to="/search">
                    Search
                </Link>

                <Link to="/tags">
                    Tags
                </Link>

                <Link
                    to="/login"
                    onClick={() => alert("Please log in first.")}
                >
                    Create Article
                </Link>

                <Link
                    to="/login"
                    onClick={() => alert("Please log in first.")}
                >
                    Notifications
                </Link>

                <Link
                    to="/login"
                    onClick={() => alert("Please log in first.")}
                >
                    My Profile
                </Link>

                <Link to="/login">
                    Login
                </Link>
            </nav>
        );
    }

    return (
        <nav className="site-nav">
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

            <Link to="/tags">
                Tags
            </Link>
        </nav>
    );
}

export default Navbar;