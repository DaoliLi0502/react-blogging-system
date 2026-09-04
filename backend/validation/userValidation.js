const yup = require("yup");

const registerSchema = yup.object({
    username: yup
        .string()
        .trim()
        .required("Username is required")
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must be at most 30 characters"),

    password: yup
        .string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),

    real_name: yup
        .string()
        .trim()
        .required("Real name is required")
        .max(100, "Real name must be at most 100 characters"),

    date_of_birth: yup
        .string()
        .required("Date of birth is required")
        .matches(
            /^\d{4}-\d{2}-\d{2}$/,
            "Date of birth must be in YYYY-MM-DD format"
        ),

    description: yup
        .string()
        .trim()
        .max(500, "Description must be at most 500 characters")
        .nullable(),

    avatar_id: yup
        .number()
        .integer()
        .positive()
        .nullable()
});

const updateProfileSchema = yup.object({
    real_name: yup
        .string()
        .trim()
        .required("Real name is required")
        .max(100, "Real name must be at most 100 characters"),

    date_of_birth: yup
        .string()
        .required("Date of birth is required")
        .matches(
            /^\d{4}-\d{2}-\d{2}$/,
            "Date of birth must be in YYYY-MM-DD format"
        ),

    description: yup
        .string()
        .trim()
        .max(500, "Description must be at most 500 characters")
        .nullable(),

    avatar_id: yup
        .number()
        .integer()
        .positive()
        .nullable()
});

module.exports = {
    registerSchema,
    updateProfileSchema
};