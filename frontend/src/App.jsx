import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AllArticles from "./pages/AllArticles";
import ArticleDetail from "./pages/ArticleDetail";
import CreateArticle from "./pages/CreateArticle";
import EditArticle from "./pages/EditArticle";
import Login from "./pages/Login";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import SearchArticles from "./pages/SearchArticles";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";

function App() {

    return (
        <BrowserRouter>

            <Navbar />

            <Routes>
                <Route path="/" element={<Navigate to="/articles" />} />
                <Route path="/articles" element={<AllArticles />} />
                <Route path="/articles/:aid" element={<ArticleDetail />} />
                <Route path="/articles/:aid/edit" element={<EditArticle />} />
                <Route path="/articles/create" element={<CreateArticle />} />
                <Route path="/login" element={<Login />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/search" element={<SearchArticles />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>

        </BrowserRouter>
    );
}

export default App;