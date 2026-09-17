import { useEffect, useState } from "react";
import axios from "axios";
import ArticleCard from "../components/ArticleCard";
import "./SearchArticles.css";

function SearchArticles() {

    const [search, setSearch] = useState("");
    const [match, setMatch] = useState("partial");
    const [sort, setSort] = useState("date");
    const [order, setOrder] = useState("desc");

    const [articles, setArticles] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [hasSearched, setHasSearched] = useState(false);

    const fetchArticles = async (pageNumber) => {

        try {

            const response = await axios.get(
                "http://localhost:3000/api/articles",
                {
                    params: {
                        search,
                        match,
                        sort,
                        order,
                        page: pageNumber,
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

    useEffect(() => {

        if (!hasSearched) {

            return;
        }

        fetchArticles(page);

    }, [page]);

    const handleSearch = async (event) => {

        event.preventDefault();

        setPage(1);
        setHasSearched(true);

        await fetchArticles(1);
    };

    return (
        <div>
            <h1>Search Articles</h1>

            <form onSubmit={handleSearch}>

                <div>
                    <label>
                        Search:
                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Match:
                        <select
                            value={match}
                            onChange={(event) => setMatch(event.target.value)}
                        >
                            <option value="partial">
                                Partial match
                            </option>

                            <option value="exact">
                                Exact match
                            </option>
                        </select>
                    </label>
                </div>

                <div>
                    <label>
                        Sort by:
                        <select
                            value={sort}
                            onChange={(event) => setSort(event.target.value)}
                        >
                            <option value="date">
                                Date
                            </option>

                            <option value="title">
                                Title
                            </option>

                            <option value="username">
                                Username
                            </option>
                        </select>
                    </label>
                </div>

                <div>
                    <label>
                        Order:
                        <select
                            value={order}
                            onChange={(event) => setOrder(event.target.value)}
                        >
                            <option value="desc">
                                Descending
                            </option>

                            <option value="asc">
                                Ascending
                            </option>
                        </select>
                    </label>
                </div>

                <button type="submit">
                    Search
                </button>

            </form>

            {errorMessage && (
                <p>{errorMessage}</p>
            )}

            <div>
                {articles.map((article) => (
                    <ArticleCard
                        key={article.article_id}
                        article={article}
                    />
                ))}
            </div>

            {hasSearched && (
                <div>
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
        </div>
    );
}

export default SearchArticles;