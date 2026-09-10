import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ArticleDetail() {
    const { aid } = useParams();

    const [article, setArticle] = useState(null);
    const [likeCount, setLikeCount] = useState(0);
    const [likedByMe, setLikedByMe] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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

    const fetchLikes = async () => {

        try {
            const response = await axios.get(
                `http://localhost:3000/api/articles/${aid}/likes`,
                {
                    withCredentials: true
                }
            );

            setLikeCount(response.data.count);
            setLikedByMe(response.data.liked_by_me);

        } catch (error) {

            setErrorMessage(error.response.data.message);
        }
    };

    const handleLike = async () => {

        try {
            if (likedByMe) {

                await axios.delete(
                    `http://localhost:3000/api/articles/${aid}/likes`,
                    {
                        withCredentials: true
                    }
                );

                await fetchLikes();

            } else {

                await axios.post(
                    `http://localhost:3000/api/articles/${aid}/likes`,
                    {},
                    {
                        withCredentials: true
                    }
                );

                await fetchLikes();
            }

        } catch (error) {

            setErrorMessage(error.response.data.message);
        }
    };

    useEffect(() => {

        fetchArticle();
        fetchLikes();

    }, [aid]);

    return (
        <div>
            <h1>Article Detail</h1>

            {errorMessage && <p>{errorMessage}</p>}

            {article && (
                <div>
                    <h2>{article.title}</h2>

                    {article.image_path && (
                        <img
                            src={`http://localhost:3000/${article.image_path}`}
                            alt={article.title}
                        />
                    )}

                    <p>{article.content}</p>

                    <p>Likes: {likeCount}</p>

                    {likedByMe ? (
                        <button onClick={handleLike}>Unlike</button>
                    ) : (
                        <button onClick={handleLike}>Like</button>
                    )}

                    <p>Author: {article.username}</p>

                    <p>Date: {article.created_at}</p>
                </div>
            )}
        </div>
    );
}

export default ArticleDetail;