var mysql = require('mysql'),
    useDB = false,
    db,
    con;

if (process.env.DB_HOST) { // checking on .env, to determine whether to run database functionality
    useDB = true;
    db = require("./db");
    con = mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
        debug: false
    });
}


/* 'messages' table handlers */
module.exports.addMessage = (message, uid) => {
    if ( ! useDB ) { return ; }
    
    con.query(`INSERT INTO messages (uid, dbid, message, ts) VALUES (\'${uid}\', 0, \'${message}\', NOW());`,
        (err, rows) => {
            if (err) {
                console.log(err);
            }
            console.log(rows);
        });
};

module.exports.getMessages = (callback) => {
    if ( ! useDB ) { return callback([]); }

    con.query('SELECT * FROM messages ORDER BY ts DESC, id DESC;', 
        (err, rows) => {
            if (err) {
                return callback([]);
            }
            return callback(rows);
    });
};