import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ArticleDetail() {
    const { aid } = useParams();

    const [article, setArticle] = useState(null);
    const [likeCount, setLikeCount] = useState(0);
    const [likedByMe, setLikedByMe] = useState(false);
    const [subscriberCount, setSubscriberCount] = useState(0);
    const [subscribedByMe, setSubscribedByMe] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const fetchArticle = async () => {

        try {
            const response = await axios.get(
                `http://localhost:3000/api/articles/${aid}`
            );

            const articleData = response.data.article;

            setArticle(articleData);

            return articleData;

        } catch (error) {

            setErrorMessage(error.response.data.message);

            return null;
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

            const likesData = response.data;

            setLikeCount(likesData.count);
            setLikedByMe(likesData.liked_by_me);

            return likesData;

        } catch (error) {

            setErrorMessage(error.response.data.message);

            return null;
        }
    };

    const fetchSubscription = async (authorId) => {

        try {
            const response = await axios.get(
                `http://localhost:3000/api/users/${authorId}/subscriptions`,
                {
                    withCredentials: true
                }
            );

            const subscriptionData = response.data;

            setSubscriberCount(subscriptionData.count);
            setSubscribedByMe(subscriptionData.subscribed_by_me);

            return subscriptionData;

        } catch (error) {

            setErrorMessage(error.response.data.message);

            return null;
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

            } else {

                await axios.post(
                    `http://localhost:3000/api/articles/${aid}/likes`,
                    {},
                    {
                        withCredentials: true
                    }
                );
            }

            await fetchLikes();

        } catch (error) {

            setErrorMessage(error.response.data.message);
        }
    };

    const handleSubscription = async () => {

        try {
            if (subscribedByMe) {

                await axios.delete(
                    `http://localhost:3000/api/subscriptions/${article.author_id}`,
                    {
                        withCredentials: true
                    }
                );

            } else {

                await axios.post(
                    "http://localhost:3000/api/subscriptions",
                    {
                        subscribed_user_id: article.author_id
                    },
                    {
                        withCredentials: true
                    }
                );
            }

            await fetchSubscription(article.author_id);

        } catch (error) {

            setErrorMessage(error.response.data.message);
        }
    };

    useEffect(() => {

        const fetchData = async () => {

            setErrorMessage("");

            const articleData = await fetchArticle();

            if (!articleData) {
                return;
            }

            const likesData = await fetchLikes();

            if (!likesData) {
                return;
            }

            const subscriptionData = await fetchSubscription(
                articleData.author_id
            );

            if (!subscriptionData) {
                return;
            }
        };

        fetchData();

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

                    <div
                        dangerouslySetInnerHTML={{
                            __html: article.content
                        }}
                    />

                    <p>Author: {article.username}</p>

                    <p>Date: {article.created_at}</p>

                    <p>Likes: {likeCount}</p>

                    {likedByMe ? (
                        <button onClick={handleLike}>
                            Unlike
                        </button>
                    ) : (
                        <button onClick={handleLike}>
                            Like
                        </button>
                    )}

                    <p>Subscribers: {subscriberCount}</p>

                    {subscribedByMe ? (
                        <button onClick={handleSubscription}>
                            Unsubscribe
                        </button>
                    ) : (
                        <button onClick={handleSubscription}>
                            Subscribe
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default ArticleDetail;