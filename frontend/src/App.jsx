import { BrowserRouter, Routes, Route } from "react-router-dom";
import AllArticles from "./pages/AllArticles";
import SearchArticles from "./pages/SearchArticles";
import ArticleDetail from "./pages/ArticleDetail";
import CreateArticle from "./pages/CreateArticle";
import EditArticle from "./pages/EditArticle";
import Login from "./pages/Login";
import Notifications from "./pages/Notifications";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/articles" element={<AllArticles />} />
                <Route path="/search" element={<SearchArticles />} />
                <Route path="/articles/create" element={<CreateArticle />} />
                <Route path="/articles/:aid" element={<ArticleDetail />} />
                <Route path="/articles/:aid/edit" element={<EditArticle />} />
                <Route path="/login" element={<Login />} />
                <Route path="/notifications" element={<Notifications />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;