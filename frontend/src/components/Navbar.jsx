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
                <Link
                    to="/articles"
                    className={location.pathname === "/articles" ? "active" : ""}
                >
                    Articles
                </Link>

                <Link
                    to="/search"
                    className={location.pathname === "/search" ? "active" : ""}
                >
                    Search
                </Link>

                <Link
                    to="/tags"
                    className={location.pathname === "/tags" ? "active" : ""}
                >
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

                <Link
                    to="/login"
                    className={location.pathname === "/login" ? "active" : ""}
                >
                    Login
                </Link>
            </nav>
        );
    }

    return (
        <nav className="site-nav">
            <Link
                to="/articles"
                className={location.pathname === "/articles" ? "active" : ""}
            >
                Articles
            </Link>

            <Link
                to="/articles/create"
                className={
                    location.pathname === "/articles/create"
                        ? "active"
                        : ""
                }
            >
                Create Article
            </Link>

            <Link
                to="/notifications"
                className={
                    location.pathname === "/notifications"
                        ? "active"
                        : ""
                }
            >
                Notifications
            </Link>

            <Link
                to="/profile"
                className={location.pathname === "/profile" ? "active" : ""}
            >
                My Profile
            </Link>

            <Link
                to="/search"
                className={location.pathname === "/search" ? "active" : ""}
            >
                Search
            </Link>

            <Link
                to="/tags"
                className={location.pathname === "/tags" ? "active" : ""}
            >
                Tags
            </Link>
        </nav>
    );
}

export default Navbar;