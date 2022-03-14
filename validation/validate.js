import validator from 'validator';

// Register Validation
const registerValidation = data => {

    // Check if email is valid
    if(!validator.isEmail(data.email)) return 'Email invalid'; 
    
    // Check if userName has between 4 and 25 characters
    if(!validator.isLength(data.userName, {min: 4, max: 25})) return 'Username invalid';

    // Need to validate more stuff

    return 'Everything Okay';

};

// Testing
console.log(registerValidation({email: 'dulayaatgmail.com', userName: 'dulaya'})); // Email invalid