import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import ArticleCard from "../components/ArticleCard";
import "./Tags.css";

function Tags() {

    const [searchParams] = useSearchParams();

    const tagId = searchParams.get("tag_id");

    const [tags, setTags] = useState([]);
    const [articles, setArticles] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const selectedTag = tags.find(
        (tag) => String(tag.tag_id) === tagId
    );

    useEffect(() => {

        const fetchTags = async () => {

            try {

                const response = await axios.get(
                    "http://localhost:3000/api/tags"
                );

                setTags(response.data.tags);

            } catch (error) {

                setErrorMessage(error.response.data.message);
            }
        };

        fetchTags();

    }, []);

    useEffect(() => {

        const fetchTagArticles = async () => {

            try {

                const response = await axios.get(
                    `http://localhost:3000/api/tags/${tagId}/articles`,
                    {
                        params: {
                            page,
                            limit: 10
                        }
                    }
                );

                setArticles(response.data.articles);
                setTotalPages(response.data.pagination.totalPages);
                setErrorMessage("");

            } catch (error) {

                setErrorMessage(error.response.data.message);
            }
        };

        if (tagId) {

            fetchTagArticles();

        } else {

            setArticles([]);
            setTotalPages(1);
        }

    }, [tagId, page]);

    return (
        <div className="page tags-page">
            <h1>All Tags</h1>

            {errorMessage && <p>{errorMessage}</p>}

            {tags.map((tag) => (
                <p key={tag.tag_id}>
                    <Link
                        to={`/tags?tag_id=${tag.tag_id}`}
                        onClick={() => setPage(1)}
                    >
                        {tag.name}
                    </Link>
                </p>
            ))}

            {tagId && (
                <section className="tag-results">
                    <h1>
                        {selectedTag
                            ? `Articles with tag: ${selectedTag.name}`
                            : "Tag Articles"}
                    </h1>

                    {articles.map((article) => (
                        <ArticleCard
                            key={article.article_id}
                            article={article}
                        />
                    ))}

                    {articles.length > 0 && (
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
                    )}
                </section>
            )}
        </div>
    );
}

export default Tags;