import { Link } from "react-router-dom";

function Navbar() {

    return (
        <nav>
            <Link to="/articles">
                Articles
            </Link>

            <Link to="/articles/create">
                Create Article
            </Link>

            <Link to="/login">
                Login
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