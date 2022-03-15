import validator from 'validator';

// Register Validation: validate user input data such as if the email is in correct format, username meets specific length/characters, etc.
export const registerValidation = data => {

    // Check if email is valid
    if(!validator.isEmail(data.email)) return 'Email is wrong format'; 
    
    // Check if userName has between 4 and 25 characters
    if(!validator.isLength(data.userName, {min: 4,})) return 'Username too short';

    if(!validator.isLength(data.userName, {max: 15,})) return 'Username too long';

    // Need to validate more stuff like password

    return 'Everything Okay';

};

