const mongoose = require('mongoose');

const OrderdataSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true,
    },
    orderdata: {
        
        type: Array,
        
        required: true,
        
    }

});

const Orderdata = mongoose.model('orderdata',OrderdataSchema  );

module.exports = Orderdata;
