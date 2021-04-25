import Joi from "joi";

const validateNewUserData = async (userData) => {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(4).max(30).required().messages({
      "string.empty": "Username cannot be empty",
      "string.alphanum": "Username must contain only alphanumeric characters",
      "string.min": "Username length must be at least 4 characters long",
      "string.max":
        "Username length must be less than or equal to 30 characters long",
      "any.required": "Username is required",
    }),
    email: Joi.string().required().email().messages({
      "string.empty": "Email cannot be empty",
      "string.email": "Email must be a valid email",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(6).max(255).required().messages({
      "string.empty": "Password cannot be empty",
      "string.min": "Password length must be at least 6 characters long",
      "string.max":
        "Password length must be less than or equal to 255 characters long",
      "any.required": "Password is required",
    }),
  });
  return await schema.validateAsync(userData);
};

export default validateNewUserData;
