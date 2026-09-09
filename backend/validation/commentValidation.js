const yup = require("yup");

const createCommentSchema = yup.object({
    content: yup
        .string()
        .trim()
        .required("Content is required")
});

module.exports = createCommentSchema;