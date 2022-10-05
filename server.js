const dotenv = require('dotenv')
const path = require('path');
const express = require('express');
const sharp = require('sharp')
const bird_router = require('./routers/bird_router');
const image_router = require('./routers/image_router');
const Birds = require('./models/birds');

/* load .env */
dotenv.config();

/* create Express app */
const app = express();



/* setup Express middleware */
// Pug for SSR (static site rendering)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// TODO: middleware for parsing POST body

app.use(express.urlencoded({extended: true}));
//app.use(express.json({extended: false}));

// TODO: middleware for uploading files

app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));


/* host static resources (.css, .js, ...) */
app.use('/images/', image_router);
app.use('/', express.static(path.resolve(__dirname, 'public/')));

/* redirect root route `/` to `/birds/` */
app.get('/', (req, res) => {
    res.redirect('/birds/');
});

app.use('/birds/', bird_router);

// TODO: 404 page

// DONE?: connect to a database

//------Mongoose things------
// Database
const mongoose = require("mongoose");
const user = process.env.ATLAS_USER;
const password = process.env.ATLAS_PASSWORD;
const db_url = `mongodb+srv://${user}:${password}@birdsofnz.mbvvhwc.mongodb.net/?retryWrites=true&w=majority`
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}
mongoose.connect(db_url, options).then(() => {
    console.log('Mongoose Successfully connected!')
}).catch((e) => {
    console.error(e, 'could not connect to Mongoose!')
});

// app.get('/api/all-birds', async (request, response) => {
//     // query all the birds
//     console.log('ye');
//     const all_birds = await Birds.find({});
    
//     // respond to the client with the messages (as json)
//     response.json(all_birds);
// });

//---------------------------


// 404 page if file not found
app.get('*', (request, response) => {
    response.status(404)
    response.render('404');
});
/* start the server */
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is live http://localhost:${PORT}`);
});
