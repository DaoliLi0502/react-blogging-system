const yup = require("yup");

const createTagSchema = yup.object({
    name: yup
        .string()
        .trim()
        .required("Tag name is required")
});

module.exports = createTagSchema;