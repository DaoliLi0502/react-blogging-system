import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ArticleDetail() {

    const { aid } = useParams();
    const navigate = useNavigate();

    const [article, setArticle] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [likeCount, setLikeCount] = useState(0);
    const [likedByMe, setLikedByMe] = useState(false);
    const [subscriberCount, setSubscriberCount] = useState(0);
    const [subscribedByMe, setSubscribedByMe] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentContent, setCommentContent] = useState("");
    const [allTags, setAllTags] = useState([]);
    const [selectedTagId, setSelectedTagId] = useState("");
    const [newTagName, setNewTagName] = useState("");
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

    const fetchComments = async () => {

        try {

            const response = await axios.get(
                `http://localhost:3000/api/articles/${aid}/comments`
            );

            const commentsData = response.data.comments;

            setComments(commentsData);

            return commentsData;

        } catch (error) {

            setErrorMessage(error.response.data.message);

            return null;
        }
    };

    const fetchAllTags = async () => {

        try {

            const response = await axios.get(
                "http://localhost:3000/api/tags"
            );

            const tagsData = response.data.tags;

            setAllTags(tagsData);

            return tagsData;

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

    const handleCommentSubmit = async (event) => {

        event.preventDefault();

        try {

            await axios.post(
                `http://localhost:3000/api/articles/${aid}/comments`,
                {
                    content: commentContent
                },
                {
                    withCredentials: true
                }
            );

            setCommentContent("");

            await fetchComments();

        } catch (error) {

            setErrorMessage(error.response.data.message);
        }
    };

    const handleCommentDelete = async (commentId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this comment?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await axios.delete(
                `http://localhost:3000/api/articles/${aid}/comments/${commentId}`,
                {
                    withCredentials: true
                }
            );

            await fetchComments();

        } catch (error) {

            setErrorMessage(error.response.data.message);
        }
    };

    const handleAddTag = async () => {

        try {

            if (!selectedTagId) {
                return;
            }

            await axios.post(
                `http://localhost:3000/api/articles/${aid}/tags`,
                {
                    tag_ids: [Number(selectedTagId)]
                },
                {
                    withCredentials: true
                }
            );

            setSelectedTagId("");

            await fetchArticle();

        } catch (error) {

            setErrorMessage(error.response.data.message);
        }
    };

    const handleCreateTag = async () => {

        try {

            const response = await axios.post(
                "http://localhost:3000/api/tags",
                {
                    name: newTagName
                },
                {
                    withCredentials: true
                }
            );

            setNewTagName("");

            await fetchAllTags();

            setSelectedTagId(String(response.data.tag_id));

        } catch (error) {

            setErrorMessage(error.response.data.message);
        }
    };

    const handleRemoveTag = async (tagId) => {

        try {

            await axios.delete(
                `http://localhost:3000/api/articles/${aid}/tags/${tagId}`,
                {
                    withCredentials: true
                }
            );

            await fetchArticle();

        } catch (error) {

            setErrorMessage(error.response.data.message);
        }
    };

    const handleDelete = async () => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this article?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await axios.delete(
                `http://localhost:3000/api/articles/${aid}`,
                {
                    withCredentials: true
                }
            );

            navigate("/articles");

        } catch (error) {

            setErrorMessage(error.response.data.message);
        }
    };

    useEffect(() => {

        const fetchData = async () => {

            setErrorMessage("");

            try {

                const response = await axios.get(
                    "http://localhost:3000/api/users/me",
                    {
                        withCredentials: true
                    }
                );

                setCurrentUser(response.data.user);

            } catch (error) {

                setCurrentUser(null);
            }

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

            await fetchComments();
            await fetchAllTags();
        };

        fetchData();

    }, [aid]);

    const isOwner =
        currentUser &&
        article &&
        article.author_id === currentUser.user_id;

    return (
        <div>
            <h1>Article Detail</h1>

            {errorMessage && <p>{errorMessage}</p>}

            {article && (
                <div>
                    <h2>{article.title}</h2>

                    {article.image_path && (
                        <img
                            src={`http://localhost:3000/${article.image_path.replace(/\\/g, "/")}`}
                            alt={article.title}
                        />
                    )}

                    <div
                        dangerouslySetInnerHTML={{
                            __html: article.content
                        }}
                    />

                    <div>
                        <h3>Tags</h3>

                        {article.tags.length === 0 ? (
                            <p>No tags yet.</p>
                        ) : (
                            <ul>
                                {article.tags.map((tag) => (
                                    <li key={tag.tag_id}>
                                        <Link to={`/search?tag_id=${tag.tag_id}`}>
                                            {tag.name}
                                        </Link>

                                        {isOwner && (
                                            <button
                                                onClick={() => handleRemoveTag(tag.tag_id)}
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {isOwner && (
                            <div>
                                <select
                                    value={selectedTagId}
                                    onChange={(event) => setSelectedTagId(event.target.value)}
                                >
                                    <option value="">
                                        Select a tag
                                    </option>

                                    {allTags
                                        .filter(
                                            (tag) =>
                                                !article.tags.some(
                                                    (articleTag) =>
                                                        articleTag.tag_id === tag.tag_id
                                                )
                                        )
                                        .map((tag) => (
                                            <option
                                                key={tag.tag_id}
                                                value={tag.tag_id}
                                            >
                                                {tag.name}
                                            </option>
                                        ))}
                                </select>

                                <button onClick={handleAddTag}>
                                    Add Tag
                                </button>

                                <div>
                                    <input
                                        type="text"
                                        value={newTagName}
                                        onChange={(event) => setNewTagName(event.target.value)}
                                        placeholder="Enter a new tag"
                                    />

                                    <button onClick={handleCreateTag}>
                                        Create Tag
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

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

                    {isOwner && (
                        <button onClick={() => navigate(`/articles/${aid}/edit`)}>
                            Edit Article
                        </button>
                    )}

                    {isOwner && (
                        <button onClick={handleDelete}>
                            Delete Article
                        </button>
                    )}

                    <h3>Comments</h3>

                    {currentUser && (
                        <form onSubmit={handleCommentSubmit}>
                            <textarea
                                value={commentContent}
                                onChange={(event) => setCommentContent(event.target.value)}
                                placeholder="Write a comment..."
                                required
                            />

                            <button type="submit">
                                Post Comment
                            </button>
                        </form>
                    )}

                    {comments.length === 0 ? (
                        <p>No comments yet.</p>
                    ) : (
                        <div>
                            {comments.map((comment) => (
                                <div key={comment.comment_id}>

                                    {comment.avatar_path && (
                                        <img
                                            src={`http://localhost:3000/${comment.avatar_path.replace(/\\/g, "/")}`}
                                            alt={comment.username}
                                            width="50"
                                        />
                                    )}

                                    <p>
                                        <strong>{comment.username}</strong>
                                    </p>

                                    <p>{comment.content}</p>

                                    <p>{comment.created_at}</p>

                                    {currentUser &&
                                        (currentUser.user_id === comment.user_id ||
                                            currentUser.user_id === article.author_id) && (
                                            <button
                                                onClick={() => handleCommentDelete(comment.comment_id)}
                                            >
                                                Delete Comment
                                            </button>
                                        )}

                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ArticleDetail;