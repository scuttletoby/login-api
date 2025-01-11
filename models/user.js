const bcrypt = require('bcrypt');
const saltRounds = 12; // Stronger salt rounds for better security

const hashPassword = async password => await bcrypt.hashSync(password, saltRounds);

// Users array with hashed passwords
const users = [
    {
        id: 1,
        username: 'user@example.com',
        password: hashPassword('password1', saltRounds), // Replace with your secure password
    },
];

module.exports = users;
