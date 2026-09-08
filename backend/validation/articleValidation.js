const yup = require("yup");

const createArticleSchema = yup.object({
    title: yup
        .string()
        .trim()
        .required("Title is required"),

    content: yup
        .string()
        .required("Content is required")
});

const updateArticleSchema = yup.object({
    title: yup
        .string()
        .trim()
        .required("Title is required"),

    content: yup
        .string()
        .required("Content is required"),

    remove_image: yup
        .boolean()
        .required("Remove image is required")
});

module.exports = {
    createArticleSchema,
    updateArticleSchema
};