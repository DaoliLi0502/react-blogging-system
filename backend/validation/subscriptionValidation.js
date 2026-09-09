const yup = require("yup");

const createSubscriptionSchema = yup.object({
    subscribed_user_id: yup
        .number()
        .integer()
        .required("Subscribed user ID is required")
});

module.exports = createSubscriptionSchema;