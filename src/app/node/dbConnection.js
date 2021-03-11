const { Client, Pool } = require('pg');

function getConnection() {
    dbConnectionURL = 'postgres://fjsbrbxppqqvvj:b9fd23c066e268899d1e2062e58a767d0b6a520aeb93e762e4a3e7418efeffe9@ec2-54-73-68-39.eu-west-1.compute.amazonaws.com:5432/d43i6d6j774qi2';

    let client = new Client({
        connectionString: dbConnectionURL,//process.env.DATABASE_URL ? process.env.DATABASE_URL : dbConnectionURL,
        ssl: {
            rejectUnauthorized: false
        }
    })
    return client;
}

var pool =  new Pool({
    user: "fjsbrbxppqqvvj",
    host: "ec2-54-73-68-39.eu-west-1.compute.amazonaws.com",
    database: "d43i6d6j774qi2",
    password: "b9fd23c066e268899d1e2062e58a767d0b6a520aeb93e762e4a3e7418efeffe9",
    port: "5432"
});

async function getCoonectionPool() {

    if(pool)
     return pool;
    // else  new Pool({
    //     user: "fjsbrbxppqqvvj",
    //     host: "ec2-54-73-68-39.eu-west-1.compute.amazonaws.com",
    //     database: "d43i6d6j774qi2",
    //     password: "b9fd23c066e268899d1e2062e58a767d0b6a520aeb93e762e4a3e7418efeffe9",
    //     port: "5432"
    // });


}

function endConnection(client) {
    client.end();
}

module.exports = {
    getConnection,
    endConnection,
    getCoonectionPool
}