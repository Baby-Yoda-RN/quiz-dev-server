import validator from 'validator';

// Register Validation: validate user input data such as if the email is in correct format, username meets specific length/characters, etc.
export const registerValidation = data => {

    // Check if email is valid
    if(!validator.isEmail(data.email)) return 'Email is wrong format'; 
    
    // Check if userName meet requirements
    if(!validator.isLength(data.Username, {min: 4,})) return 'Username must be at least 4 characters';

    if(!validator.isLength(data.Username, {max: 15,})) return 'Username must be at most 15 characters';

    // Check if password meet requirements
    if(!validator.isLength(data.Password, {min: 6,})) return 'Password must be at least 6 characters';

    if(!validator.isLength(data.Password, {max: 25,})) return 'Password must be at most 25 characters';

    return 'Everything Okay';

};

