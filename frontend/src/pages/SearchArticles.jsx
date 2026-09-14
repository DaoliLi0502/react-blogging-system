import { useEffect, useState } from "react";
import axios from "axios";
import ArticleCard from "../components/ArticleCard";

function SearchArticles() {

    const [search, setSearch] = useState("");
    const [match, setMatch] = useState("partial");
    const [sort, setSort] = useState("date");
    const [order, setOrder] = useState("desc");
    const [articles, setArticles] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [allTags, setAllTags] = useState([]);
    const [selectedTagId, setSelectedTagId] = useState("");

    useEffect(() => {

        const fetchAllTags = async () => {

            try {

                const response = await axios.get(
                    "http://localhost:3000/api/tags"
                );

                setAllTags(response.data.tags);

            } catch (error) {

                setErrorMessage(error.response.data.message);
            }
        };

        fetchAllTags();

    }, []);

    const handleSearch = async (event) => {

        event.preventDefault();

        try {

            const response = await axios.get(
                "http://localhost:3000/api/articles",
                {
                    params: {
                        search,
                        match,
                        sort,
                        order
                    }
                }
            );

            setArticles(response.data.articles);
            setErrorMessage("");

        } catch (error) {

            setErrorMessage(error.response.data.message);
        }
    };

    const handleTagSearch = async () => {

        try {

            const response = await axios.get(
                `http://localhost:3000/api/tags/${selectedTagId}/articles`
            );

            setArticles(response.data.articles);
            setErrorMessage("");

        } catch (error) {

            setErrorMessage(error.response.data.message);
        }
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

            <div>
                <label>
                    Search by Tag:
                    <select
                        value={selectedTagId}
                        onChange={(event) => setSelectedTagId(event.target.value)}
                    >
                        <option value="">
                            Select a tag
                        </option>

                        {allTags.map((tag) => (
                            <option
                                key={tag.tag_id}
                                value={tag.tag_id}
                            >
                                {tag.name}
                            </option>
                        ))}
                    </select>
                </label>

                <button
                    onClick={handleTagSearch}
                    disabled={!selectedTagId}
                >
                    Search by Tag
                </button>
            </div>

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
        </div>
    );
}

export default SearchArticles;