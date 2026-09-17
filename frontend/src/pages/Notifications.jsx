import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Notifications.css";

function Notifications() {

    const navigate = useNavigate();

    const [commentNotifications, setCommentNotifications] = useState([]);
    const [subscriptionNotifications, setSubscriptionNotifications] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    const fetchCommentNotifications = async () => {

        try {

            const response = await axios.get(
                "http://localhost:3000/api/comment-notifications",
                {
                    withCredentials: true
                }
            );

            setCommentNotifications(response.data.notifications);

        } catch (error) {

            setErrorMessage(error.response.data.message);
        }
    };

    const fetchSubscriptionNotifications = async () => {

        try {

            const response = await axios.get(
                "http://localhost:3000/api/subscription-notifications",
                {
                    withCredentials: true
                }
            );

            setSubscriptionNotifications(response.data.notifications);

        } catch (error) {

            setErrorMessage(error.response.data.message);
        }
    };

    const handleCommentNotificationRead = async (notificationId) => {

        try {

            await axios.put(
                `http://localhost:3000/api/comment-notifications/${notificationId}`,
                {},
                {
                    withCredentials: true
                }
            );

            await fetchCommentNotifications();

        } catch (error) {

            setErrorMessage(error.response.data.message);
        }
    };

    const handleSubscriptionNotificationRead = async (notificationId) => {

        try {

            await axios.put(
                `http://localhost:3000/api/subscription-notifications/${notificationId}`,
                {},
                {
                    withCredentials: true
                }
            );

            await fetchSubscriptionNotifications();

        } catch (error) {

            setErrorMessage(error.response.data.message);
        }
    };

    useEffect(() => {

        const fetchNotifications = async () => {

            setErrorMessage("");

            try {

                await axios.get(
                    "http://localhost:3000/api/users/me",
                    {
                        withCredentials: true
                    }
                );

                await fetchCommentNotifications();
                await fetchSubscriptionNotifications();

            } catch (error) {

                if (error.response.status === 401) {

                    navigate("/login");

                    return;
                }

                setErrorMessage(error.response.data.message);
            }
        };

        fetchNotifications();

    }, []);

    return (
        <div>
            <h1>Notifications</h1>

            {errorMessage && (
                <p>{errorMessage}</p>
            )}

            <h2>Comment Notifications</h2>

            {commentNotifications.length === 0 ? (
                <p>No comment notifications.</p>
            ) : (
                <div>
                    {commentNotifications.map((notification) => (
                        <div key={notification.comment_notification_id}>

                            {notification.avatar_path && (
                                <img
                                    src={`http://localhost:3000/${notification.avatar_path.replace(/\\/g, "/")}`}
                                    alt={notification.commenter_username}
                                    width="50"
                                />
                            )}

                            <p
                                onClick={() => navigate(
                                    `/articles/${notification.article_id}`
                                )}
                            >
                                <strong>
                                    {notification.commenter_username}
                                </strong>{" "}
                                commented on your article.
                            </p>

                            <p>{notification.content}</p>

                            <p>{notification.created_at}</p>

                            {notification.is_read === 0 && (
                                <button
                                    onClick={() => handleCommentNotificationRead(
                                        notification.comment_notification_id
                                    )}
                                >
                                    Mark as read
                                </button>
                            )}

                        </div>
                    ))}
                </div>
            )}

            <h2>Subscription Notifications</h2>

            {subscriptionNotifications.length === 0 ? (
                <p>No subscription notifications.</p>
            ) : (
                <div>
                    {subscriptionNotifications.map((notification) => (
                        <div key={notification.subscription_notification_id}>

                            {notification.avatar_path && (
                                <img
                                    src={`http://localhost:3000/${notification.avatar_path.replace(/\\/g, "/")}`}
                                    alt={notification.author_username}
                                    width="50"
                                />
                            )}

                            <p
                                onClick={() => navigate(
                                    `/articles/${notification.article_id}`
                                )}
                            >
                                New article from{" "}
                                <strong>
                                    {notification.author_username}
                                </strong>
                            </p>

                            <p>{notification.title}</p>

                            <p>{notification.created_at}</p>

                            {notification.is_read === 0 && (
                                <button
                                    onClick={() => handleSubscriptionNotificationRead(
                                        notification.subscription_notification_id
                                    )}
                                >
                                    Mark as read
                                </button>
                            )}

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Notifications;