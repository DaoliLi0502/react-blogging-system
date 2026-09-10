import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ArticleDetail() {
    const { aid } = useParams();

    const [article, setArticle] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {

        const fetchArticle = async () => {

            try {
                const response = await axios.get(
                    `http://localhost:3000/api/articles/${aid}`
                );

                setArticle(response.data.article);

            } catch (error) {

                setErrorMessage(error.response.data.message);
            }
        };

        fetchArticle();

    }, [aid]);

    return (
        <div>
            <h1>Article Detail</h1>

            {errorMessage && <p>{errorMessage}</p>}

            {article && (
                <div>
                    <h2>{article.title}</h2>
                    <p>{article.content}</p>
                    <p>Author: {article.username}</p>
                    <p>Date: {article.created_at}</p>
                </div>
            )}
        </div>
    );
}

export default ArticleDetail;