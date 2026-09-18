import { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreateArticle.css";

function CreateArticle() {

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {

        const fetchData = async () => {

            try {

                await axios.get(
                    "http://localhost:3000/api/users/me",
                    {
                        withCredentials: true
                    }
                );

            } catch (error) {

                if (error.response.status === 401) {

                    navigate("/login");

                    return;
                }

                setErrorMessage(error.response.data.message);
            }
        };

        fetchData();

    }, []);

    const handleImageChange = (event) => {

        const selectedImage = event.target.files[0];

        setImage(selectedImage);
    };

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

            setErrorMessage(error.response.data.message);
        }
    };

    return (
        <div className="page editor-page">
            <h1>Create Article</h1>

            <form className="editor-form" onSubmit={handleSubmit}>

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
                    onChange={handleImageChange}
                />

                {image && (
                    <div>
                        <p>Image preview:</p>

                        <img
                            src={URL.createObjectURL(image)}
                            alt="Article preview"
                            width="300"
                        />
                    </div>
                )}

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
