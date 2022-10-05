const express = require('express');
const multer = require('multer');
const sharp = require("sharp");
//const upload = multer({dest: './public/data/uploads/'});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
});
var upload = multer({ storage:storage });

var bird_controller = require('../controllers/bird_controller');
const Birds = require('../models/birds');

/* create a router (to export) */
const router = express.Router();

/* route the default URL: `/birds/ */
router.get('/', async (req, res) => {
    // extract the query params
    const search = req.query.search;
    const status = req.query.status;
    const sort = req.query.sort;

    const all_birds = await Birds.find({});

    // render the Pug template 'home.pug' with the filtered data
    res.render('home', {
        birds: bird_controller.filter_bird_data(search, status, sort, all_birds)
    });
})

// TODO: finishe the "Create" route(s)
router.get('/create', (req, res) => {
    res.render('create_birds');
});
router.post('/create', upload.single('photo_upload'), async (req, res) => { 
    //console.log("AAHHHHH" + JSON.stringify(req.file));  
    const new_bird = {
        primary_name: req.body.primary_name,
        scientific_name: req.body.scientific_name,
        english_name: req.body.english_name,
        order: req.body.primary_name,
        family: req.body.family,
        size: {
            length: {
                value: req.body.length,
                units: 'cm'
            },
            weight: {
                value: req.body.weight,
                units: 'g'
            }
        },
        status: req.body.status,
        photo: {
            credit: req.body.photo_credit,
            source: req.file.filename
        }
    }

    //console.log(new_bird);

    const db_info = await Birds.create(new_bird);
    //console.log(db_info);
    res.redirect('/');
});

// TODO: get individual bird route(s)
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    console.log(id);
    var individual_bird;
    try{
        individual_bird = await Birds.findById(id);
        res.render('individual_bird', { bird: individual_bird});
        console.log(individual_bird);
    } catch(CastError){
        console.log("BIRD NOT FOUND!!");
        res.status(404)
        res.render('404');
    }
  
});
// TODO: Update bird route(s)

router.get('/:id/update', async (req, res) => {
    const id = req.params.id;
    
    
    try{
        var individual_bird = await Birds.findByIdAndUpdate(id);
        
        res.render('update_bird', {bird: individual_bird});
    } catch (Error){
        console.log("BIRD NOT FOUND");
        res.status(404)
        res.render('404');
    }
    
});

router.post('/:id/update', upload.single('photo_upload'), async (req, res) => {
    const id = req.params.id;
    console.log("URL id: " + id);
    //console.log("AAHHHHH" + JSON.stringify(req.file));
    
    
    var filename;
    try{
       filename = req.file.filename;
    } catch (Error){
        filename = req.body.photo_source;
    }
    console.log(filename);
    const new_bird = {
        primary_name: req.body.primary_name,
        scientific_name: req.body.scientific_name,
        english_name: req.body.english_name,
        order: req.body.primary_name,
        family: req.body.family,
        size: {
            length: {
                value: req.body.length,
                units: 'cm'
            },
            weight: {
                value: req.body.weight,
                units: 'g'
            }
        },
        status: req.body.status,
        photo: {
            credit: req.body.photo_credit,
            source: filename
        }
    }

    //console.log(new_bird);
    await Birds.findByIdAndUpdate(id, new_bird);
    //const db_info = await Birds.create(new_bird);
    //console.log(db_info);
    res.redirect('/');
});




// TODO: Delete bird route(s)
router.get('/:id/delete', async (req, res) => {
    // currently does nothing except redirect to home page
    const id = req.params.id;

    var individual_bird;
    try{
        individual_bird = await Birds.findByIdAndDelete(id);        //console.log("I tried by best to delete " + id);
    } catch(CastError){
        console.log("uhoh");
        res.status(404)
        res.render('404');
    }
    
    
    res.redirect('/');
});

//404 page
// 404 page if file not found
router.get('*', (request, response) => {
    response.status(404)
    response.render('404');
});

module.exports = router; // export the router