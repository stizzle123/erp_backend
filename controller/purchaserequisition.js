var mongoose = require('mongoose');
var PurchaseRequisition = mongoose.model('PurchaseRequisition');
var Department = mongoose.model('Department');
var Utility = require("../commons/utility");
var User = mongoose.model('User');
var mailer = require('../model/mailer');
var Status = require("../commons/Status");


exports.index = (req, res, next)=>{
    const token = req.headers.authorization
    var user = new User();
    const tokenz = user.getUser(token);
    if(tokenz.role === "procurement"){
        PurchaseRequisition.find().populate('requestor department').sort({created:-1}).exec((err, docs)=>{
            if (err) return next(err);
            else res.send(docs);
        });
    }else{
        const option = (tokenz.department)? {department: tokenz.department._id} :{};
        PurchaseRequisition.find(option).populate('requestor department').sort({created:-1}).exec((err, docs)=>{
            if (err) return next(err);
            else res.send(docs);
        });
    }

}


exports.save = (req, res, next)=>{
    const data = req.body;
    data.created = new Date();
    let purchaserequisition = new PurchaseRequistion(data);
    purchaserequisition.save(function (err,result) {
        if (err) return next(err);
        // saved!
        res.send(result);
      });
}


 exports.submit = (req, res, next)=>{
    const data = req.body;
    data.dateneeded = data.dateneeded;
    data.created = new Date();
    let purchaserequisition = new PurchaseRequisition(data);
    purchaserequisition.save((err,result)=> {
        if (err) return next(err);
        const prefix = "REQ";
        // saved!
        const requisitionNo  = Utility.generateReqNo(prefix, data.departmentslug, result.id);
        PurchaseRequisition.updateOne({_id:result.id}, {requisitionno: requisitionNo.toUpperCase()}, (err,r)=>{
            if (err) return next(err);
            Department.findOne({deparment: result.deparment}).populate("hod").exec((err, dept)=>{
                if (err) return next(err);
                send_new_requisition_email({id: result.id, dept}, res, next);
            })
            res.send(result);
        });
    });
}

let send_new_requisition_email = function(req, res, next ){
    // setup email data with unicode symbols
    const request_link = Utility.generateLink("/requisition/view/",req.id);
    let mailOptions = {
        from: process.env.EMAIL_FROM, // sender address
        to: req.dept.hod.email,
        //bcc: process.env.IAC_GROUP_EMAIL, 
        subject: 'New Purchase Request Submitted', // Subject line
        text: 'A purchase requisition has been submitted for you review and approval.\n To view, please click the link below: Link: '+request_link+' \n If you do not see a link, kindly copy out the text in the line above and paste into your browser.\nRegards \nThe Russelsmith Team.', // plain text body
        html: '<p>A purchase requisition has been submitted for you review and approval.</p><p> To view, please click the link below: Link: <a href="'+request_link+'">RS Edge</a></p><p> If you do not see a link, kindly copy out the text in the line above and paste into your browser.</p><br /><p>Regards </p><p>The Russelsmith Team.</p>', // plain text body
      };
    mailer.sendMail(mailOptions, res, next);
}

let sendApprovalEmail = function(req, res, next){
    const request_link = Utility.generateLink("/requisition/view/",req.id);
    const status = Status.getStatus(req.status);
    const reason = (req.reason)? req.reason: "";

    let mailOptions = {
        from: process.env.EMAIL_FROM, // sender address
        to: req.requestor.email,
        //bcc: process.env.IAC_GROUP_EMAIL, 
        subject: status+ " "+ req.requisitionno, // Subject line
        text: status+' Purchase requisition with No: '+req.requisitionno+' .\n Reason .\n'+reason+' \n To view, please click the link below: Link: '+request_link+' \n If you do not see a link, kindly copy out the text in the line above and paste into your browser.\nRegards \nThe Russelsmith Team.', // plain text body
        html: '<p>'+status+' Purchase requisition with No '+req.requisitionno+'.</p>"<p><b>Reason</b></p><p>'
        +reason+'</p><p> To view, please click the link below: Link: <a href="'+request_link+'">RS Edge</a></p><p> If you do not see a link, kindly copy out the text in the line above and paste into your browser.</p><br /><p>Regards </p><p>The Russelsmith Team.</p>', // plain text body
      };
    mailer.sendMail(mailOptions, res, next);
}

exports.view = (req, res, next)=>{
    PurchaseRequisition.findOne({_id: req.params.id}).populate('requestor department').exec((err, doc)=>{
        if (err) return next(err);
        res.send(doc);
    });
}

exports.updateStatus = (req, res, next)=>{
    update(req, res, next,(result)=>{
        PurchaseRequisition.findOne({_id: req.params.id}).populate('requestor').exec((err, doc)=>{
            sendApprovalEmail(doc, res,next);
        });
        res.send(result);
    });
}

exports.resubmitted = (req, res, next)=>{
    update(req, res, next,(result)=>{
        if (err) return next(err);
        Department.findOne({deparment: result.deparment}).populate("hod").exec((err, dept)=>{
            if (err) return next(err);
            send_new_requisition_email({id: result.id, dept}, res, next);
        })
    });   
}

let update = (req, res, next, callback)=>{
    PurchaseRequisition.updateOne({_id:req.params.id}, req.body, (err,result)=>{
        if (err) return next(err);
        callback(result);
    });
}