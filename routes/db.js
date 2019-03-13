var mysql = require('mysql'),
    pg = require('pg'),
    useDB = false,
    postgres
;

if (process.env.DB_HOST) { // checking on .env, to determine whether to run database functionality
    useDB = true
    postgres = new pg.Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
    });
    // useDB = false;
}


/* users' handlers postgres */

module.exports.getUsers = (callback) => {
    // if ( ! useDB ) { return ; }

    postgres.query('SELECT * FROM Users', (err, res) => {
        console.log(res.rows);
    });
}

module.exports.createUser = (uid, username) => {
    let query = `INSERT INTO "users" ( "uid", "username") VALUES (\'${uid}\', \'${username}\');`;
    postgres.query(query, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.log(res.rows);
        }
    });
}
// this.createUser('dfjekfjkqwjef', 'jeffbizzle')







/* 'messages' table handlers for postgres */

module.exports.createMessage = (message, uid) => {
    if ( ! useDB ) { return ; }
    let query = `INSERT INTO messages (uid, dbid, message, ts) VALUES (\'${uid}\', 1, \'${message}\', NOW());`;
    postgres.query(query, (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
        }
    });
};
this.createMessage('hello world!', 'dfjekfjkqwjef');

module.exports.getMessages = (callback) => {
    if ( ! useDB ) { return callback([]); }

    postgres.query('SELECT * FROM messages ORDER BY ts DESC, id DESC;', 
        (err, rows) => {
            if (err) {
                return callback([]);
            }
            return callback(rows);
    });
};
