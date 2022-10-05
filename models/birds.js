const mongoose = require("mongoose");


const measurement = new mongoose.Schema({
    value: {type: Number, required: true},
    units: {type: String, required: true}
});

const size = new mongoose.Schema({
    length: {type: measurement, required: true},
    weight: {type: measurement, required: true}
});

const photo = new mongoose.Schema({
    credit: {type: String, required: true},
    source: {type: String, required: true}
})

const birdSchema = new mongoose.Schema({
    primary_name: { type: String, required: true },
    scientific_name: { type: String, required: true },
    english_name: {type: String, required: true},
    order: {type: String, required: true},
    family: {type: String, required: true},
    other_names: {type: Array, required: true},
    status: {type: String, required: true},
    photo: {type: photo, required: true},
    size: {type: size, required:true}

});



const Birds = mongoose.model('birds', birdSchema);

module.exports = Birds;