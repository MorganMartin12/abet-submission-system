const User = require('../models/User')

const is_whitelisted = async (linkblue_username) => {
    //this function attempts to search the user table and pull the user based on their username
    //returns true if the user is found, returns false if the user is not found
    const user = await User.query().findById(linkblue_username);

    if(user){
        return true;
    }
    else{
        return false;
    }
}

module.exports.is_whitelisted = is_whitelisted