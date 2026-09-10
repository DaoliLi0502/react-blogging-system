import { useEffect, useState } from "react";
import axios from "axios";
import ArticleCard from "../components/ArticleCard";

function AllArticles() {
    const [articles, setArticles] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {

        const fetchArticles = async () => {

            try {
                const response = await axios.get(
                    "http://localhost:3000/api/articles"
                );

                setArticles(response.data.articles);

            } catch (error) {

                setErrorMessage(error.response.data.message);
            }
        };

        fetchArticles();

    }, []);

    return (
        <div>
            <h1>All Articles</h1>

            {errorMessage && <p>{errorMessage}</p>}

            {articles.map((article) => (
                <ArticleCard
                    key={article.article_id}
                    article={article}
                />
            ))}
        </div>
    );
}

export default AllArticles;