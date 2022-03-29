import validator from "validator";

// Register Validation: validate user input data such as if the email is in correct format, username meets specific length/characters, etc.
export const registerValidation = (data) => {
  try {
    // Check if email is valid
    if (!validator.isEmail(data.Email)) return "Email is wrong format";

    // Check if password meet requirements
    if (!validator.isLength(data.Password, { min: 6 }))
      return "Password must be at least 6 characters";

    if (!validator.isLength(data.Password, { max: 25 }))
      return "Password must be at most 25 characters";

    return "Everything Okay";
  } catch (error) {
    console.error(error);
    
  }
};
