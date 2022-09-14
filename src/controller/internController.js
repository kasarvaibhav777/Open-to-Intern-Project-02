let collegeModel= require("../models/collegeModel")
let internModel= require("../models/internModel")


let createIntern = async function (req, res) {
    try {

        if (req.body && Object.keys(req.body).length > 0) {
            let college = await collegeModel.findOne({name: req.body.collegeName, isDeleted: false })
             if(!college){
                res.status(400).send({status: false, msg: "Request must contain a college"})
             } else {
                let internData = {
                    name: req.body.name,
                    email: req.body.email,
                    mobile: req.body.mobile,
                    collegeId: college._id
                }
                let intern = await internModel.create(internData)
                res.status(201).send({ status: true, data: intern})
             }
        }else {
            res.status(400).send({ status: false, msg: "Request not contains a body"})
        }
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports.createIntern = createIntern
