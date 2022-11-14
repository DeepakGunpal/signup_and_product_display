const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const route = require('./route');
require('dotenv/config');
const cluster = require("cluster");
const os = require("os");
const numCPUs = os.cpus().length;

const app = express();
const PORT = process.env.PORT || 5000;
const path = require('path');

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', route)

if (process.env.NODE_ENV == "production") {

    app.use(express.static(process.cwd(), 'client', 'build', 'index.html'));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(process.cwd(), 'client', 'build', 'index.html'));
    })
}
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true })
    .then(() => console.log('db connection established'));

// For Master process
if (cluster.isMaster) {
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) cluster.fork();
    // This event is firs when worker died
    cluster.on('exit', () => cluster.fork());
} else {
    app.listen(PORT, () => console.log('listening on port: http://localhost:' + PORT));
}