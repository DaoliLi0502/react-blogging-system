import { useState } from "react";

function SearchArticles() {

    const [search, setSearch] = useState("");
    const [match, setMatch] = useState("partial");
    const [sort, setSort] = useState("date");
    const [order, setOrder] = useState("desc");

    const handleSearch = (event) => {

        event.preventDefault();

        console.log({
            search,
            match,
            sort,
            order
        });
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
        </div>
    );
}

export default SearchArticles;