var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var requestQuotationSchema = Schema({
    vendor:{
        type: Schema.Types.ObjectId,
        ref: 'Vendor'
    },
    requisition: {
        type: Schema.Types.ObjectId,
        ref: 'PurchaseRequisition'
    },
    lineitems: Object,
    no: String,
    updated: { type: Date, default: Date.now },
    created: { type: Date},
    status: String,
    price: Number, 
    currency:{
        type: Schema.Types.ObjectId,
        ref: 'Currency'
    },
    creditterms:Number,
    reason: String,
    accepted: Boolean,
    rejection_reason: String,
    meetQuality: Boolean,
    meetSpec: Boolean,
    onTime: Boolean,
    rfqTime: Boolean
});


mongoose.model('RequestQuotation', requestQuotationSchema);