import { BrowserRouter, Routes, Route } from "react-router-dom";
import AllArticles from "./pages/AllArticles";
import ArticleDetail from "./pages/ArticleDetail";
import Login from "./pages/Login";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/articles" element={<AllArticles />} />
                <Route path="/articles/:aid" element={<ArticleDetail />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;