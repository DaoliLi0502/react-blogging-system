import { useEffect, useState } from "react";
import axios from "axios";
import ArticleCard from "../components/ArticleCard";
import "./AllArticles.css";

function AllArticles() {
    const [articles, setArticles] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {

        const fetchArticles = async () => {

            try {
                const response = await axios.get(
                    "http://localhost:3000/api/articles",
                    {
                        params: {
                            page,
                            limit: 10
                        }
                    }
                );

                setArticles(response.data.articles);
                setTotalPages(response.data.pagination.totalPages);

            } catch (error) {

                setErrorMessage(error.response.data.message);
            }
        };

        fetchArticles();

    }, [page]);

    return (
        <div className="page articles-page">
            <h1>All Articles</h1>

            {errorMessage && <p>{errorMessage}</p>}

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
        </div>
    );
}

export default AllArticles;
