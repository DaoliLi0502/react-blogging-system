import { Link } from "react-router-dom";
import "./ArticleCard.css";

function ArticleCard({ article }) {
    return (
        <div>
            <h2>
                <Link to={`/articles/${article.article_id}`}>
                    {article.title}
                </Link>
            </h2>

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
        </div>
    );
}

export default ArticleCard;