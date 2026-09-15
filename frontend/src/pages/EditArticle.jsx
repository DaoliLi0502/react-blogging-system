import { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditArticle() {

    const { aid } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [article, setArticle] = useState(null);

    const [imageOption, setImageOption] = useState("keep");
    const [selectedImage, setSelectedImage] = useState(null);

    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {

        const fetchData = async () => {

            try {

                await axios.get(
                    "http://localhost:3000/api/users/me",
                    {
                        withCredentials: true
                    }
                );

                const response = await axios.get(
                    `http://localhost:3000/api/articles/${aid}`
                );

                setArticle(response.data.article);
                setTitle(response.data.article.title);
                setContent(response.data.article.content);

            } catch (error) {

                if (error.response.status === 401) {

                    navigate("/login");

                    return;
                }

                setErrorMessage(
                    error.response.data.message
                );
            }
        };

        fetchData();

    }, [aid]);

    const handleImageOptionChange = (event) => {

        setImageOption(event.target.value);

        if (event.target.value !== "change") {

            setSelectedImage(null);
        }
    };

    const handleImageChange = (event) => {

        setSelectedImage(event.target.files[0]);
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        setErrorMessage("");

        const formData = new FormData();

        formData.append("title", title);
        formData.append("content", content);

        if (imageOption === "keep") {

            formData.append("remove_image", "false");
        }

        if (imageOption === "change") {

            if (!selectedImage) {

                setErrorMessage("Please select an image");
                return;
            }

            formData.append("image", selectedImage);
            formData.append("remove_image", "false");
        }

        if (imageOption === "delete") {

            formData.append("remove_image", "true");
        }

        try {

            await axios.put(
                `http://localhost:3000/api/articles/${aid}`,
                formData,
                {
                    withCredentials: true
                }
            );

            navigate(`/articles/${aid}`);

        } catch (error) {

            setErrorMessage(
                error.response.data.message
            );
        }
    };

    return (
        <div>
            <h1>Edit Article</h1>

            <form onSubmit={handleSubmit}>

                <div>
                    <p>Title</p>

                    <input
                        type="text"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        required
                    />
                </div>

                <div>
                    <p>Content</p>

                    <Editor
                        apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                        value={content}
                        onEditorChange={(newContent) => setContent(newContent)}
                        init={{
                            height: 400,
                            menubar: false,
                            plugins: "lists link",
                            toolbar:
                                "undo redo | blocks | bold italic underline | bullist numlist | link"
                        }}
                    />
                </div>

                <div>
                    <p>Image</p>

                    <div>
                        <input
                            type="radio"
                            name="imageOption"
                            value="keep"
                            checked={imageOption === "keep"}
                            onChange={handleImageOptionChange}
                        />

                        Keep current image
                    </div>

                    <div>
                        <input
                            type="radio"
                            name="imageOption"
                            value="change"
                            checked={imageOption === "change"}
                            onChange={handleImageOptionChange}
                        />

                        Change image
                    </div>

                    <div>
                        <input
                            type="radio"
                            name="imageOption"
                            value="delete"
                            checked={imageOption === "delete"}
                            onChange={handleImageOptionChange}
                        />

                        Delete image
                    </div>

                    {imageOption === "keep" &&
                        article &&
                        article.image_path && (
                            <div>
                                <p>Current image:</p>

                                <img
                                    src={`http://localhost:3000/${article.image_path.replace(/\\/g, "/")}`}
                                    alt="Current article"
                                    width="300"
                                />
                            </div>
                        )}

                    {imageOption === "change" && (
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />

                            {selectedImage && (
                                <div>
                                    <p>New image:</p>

                                    <img
                                        src={URL.createObjectURL(selectedImage)}
                                        alt="New article"
                                        width="300"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {imageOption === "delete" && (
                        <p>
                            The current image will be deleted.
                        </p>
                    )}
                </div>

                <button type="submit">
                    Save Changes
                </button>

            </form>

            {errorMessage && (
                <p>{errorMessage}</p>
            )}
        </div>
    );
}

export default EditArticle;