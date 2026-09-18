import { Link } from "react-router-dom";
import "./ArticleCard.css";

function ArticleCard({ article }) {
    return (
        <div className="article-card">
            <h2>
                <Link to={`/articles/${article.article_id}`}>
                    {article.title}
                </Link>
            </h2>

            {article.image_path && (
                <img
                    src={`http://localhost:3000${article.image_path}`}
                    alt={article.title}
                />
            )}

            <div
                className="article-card__excerpt"
                dangerouslySetInnerHTML={{
                    __html: article.content
                }}
            />

            <p className="article-card__author">By {article.username}</p>
            <p className="article-card__date">{article.created_at}</p>
        </div>
    );
}

export default ArticleCard;
