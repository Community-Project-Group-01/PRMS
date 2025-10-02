const sanitizeLog = (data) => {
    if (!data) return {};

    const clone = { ...data };

    // remove sensitive fields
    const sensitiveFields = ["password", "confirmPassword", "oldPassword", "newPassword", "token"];
    sensitiveFields.forEach((field) => {
        if (clone[field]) clone[field] = "***FILTERED***";
    });

    return clone;
};

module.exports = { sanitizeLog }