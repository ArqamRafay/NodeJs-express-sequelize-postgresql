const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken")
var expressJWT = require("express-jwt")
const app = express();
const db = require("./app/models");
// db.sequelize.sync();
// db.sequelize.sync({ alter: false });
db.sequelize.sync().then(() => {
    console.log("All models were synchronized successfully.");
    console.log("Drop and re-sync db.");
}, { logging: false });

var corsOptions = { origin: "http://localhost:8081" };
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//SECRET FOR JSON WEB TOKEN
let secret = 'some_secret';

/* ALLOW PATHS WITHOUT TOKEN AUTHENTICATION */
app.use(expressJWT({ secret: secret, algorithms: ['HS256'] }).unless(
    {
        path: [
            '/token/createNewUser',
            '/',
            '/createCustomeTable'
        ]
    }
))


function generateAccessToken(userData) {
    return jwt.sign(userData, secret, { expiresIn: '1800s' })   // 1800 (30 minutes)
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, secret, (err, user) => {
        console.log(err)

        if (err) return res.sendStatus(403)
        console.log(user)
        req.user = user

        next()
    })
}
// Generating a Token
app.get('/token/createNewUser', (req, res) => {
    var userData = {
        "name": "Muhammad Bilal",
        "id": "4321"
    }
    const token = generateAccessToken(userData)
    return res.status(200).json({ "token": token });
})

// Authenticating a Token
app.get('/token/userOrders', authenticateToken, (req, res) => {
    return res.status(200).json({
        "success": true,
        "msg": "Secrect Access Granted"
    });
});

// Public route
app.get("/", (req, res) => {
    return res.json({ message: "Welcome to application." });
});

app.get("/createCustomeTable", (req, res) => {
    // type:sequelize.QueryTypes.SELECT
    let query = `CREATE TABLE userOne (
        user_id serial PRIMARY KEY,
        username VARCHAR ( 50 ) UNIQUE NOT NULL,
        password VARCHAR ( 50 ) NOT NULL,
        email VARCHAR ( 255 ) UNIQUE NOT NULL,
        created_on TIMESTAMP NOT NULL,
            last_login TIMESTAMP 
    );`
    // db.sequelize.query('SELECT * FROM articles')
    db.sequelize.query(query)

        .then(function (dps) {
            console.log(dps[0])
            return res.json({ datapoints: dps[0] });

        });
    // return res.json({ message: "Welcome to custome table area." });
});

require("./app/routes/tutorial.routes")(app);
require("./app/routes/article.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});