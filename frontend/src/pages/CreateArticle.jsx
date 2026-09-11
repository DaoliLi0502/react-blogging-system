import { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateArticle() {

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (event) => {

        event.preventDefault();

        setErrorMessage("");

        const formData = new FormData();

        formData.append("title", title);
        formData.append("content", content);

        if (image) {
            formData.append("image", image);
        }

        try {

            await axios.post(
                "http://localhost:3000/api/articles",
                formData,
                {
                    withCredentials: true
                }
            );

            navigate("/articles");

        } catch (error) {

            setErrorMessage(
                error.response?.data?.message || "Failed to create article"
            );
        }
    };

    return (
        <div>
            <h1>Create Article</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    placeholder="Article title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    required
                />

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

                <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => setImage(event.target.files[0])}
                />

                <button type="submit">
                    Create Article
                </button>

            </form>

            {errorMessage && (
                <p>{errorMessage}</p>
            )}
        </div>
    );
}

export default CreateArticle;