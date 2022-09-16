//=====================Importing Module and Packages=====================//
let collegeModel = require("../models/collegeModel")



//=====================Function to check type of key value=====================//

let checkValid = function (value) {
    if (typeof value == "undefined" || typeof value == "number" || value.length == 0 || typeof value == null) {
        return false
    } else if (typeof value == "string") {
        return true
    }
    return true
}


//===============================Create Colleges==============================================//
const createColleges = async function (req, res) {
    try {
        let data = req.body

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ Error: "Body should be not empty" })
        }

        let { name, fullName, logoLink } = data

        //=====================check Mandatory keys=====================//
       
        if (!(name && fullName && logoLink)) {
           return  res.status(400).send({ status: false, msg: "Mandatory fields are required" })
        }


         //=====================Validation of name=====================//

        if (!checkValid(name)) return res.status(400).send({ status: false, message: "Please Provide valid Input" })
        if (!(/^[a-z]+$\b/).test(name)) return res.status(400).send({ status: false, msg: "Please Use Correct Characters in name" })

        let duplicateName = await collegeModel.findOne({ name: name })
        if (duplicateName) { return res.status(409).send({ status: false, msg: "This name already exists please provide another name." }) }


         //=====================Validation of fullName=====================//

        if (!checkValid(fullName)) return res.status(400).send({ status: false, message: "Please Provide valid Input" })
        if (!(/^([A-Za-z]+[,]?[ ]?|[A-Za-z]+['-]?)+$/).test(fullName)) return res.status(400).send({ status: false, msg: "Please Use Correct Characters in fullname" })
        let checkDuplicate = await collegeModel.findOne({ fullName: fullName })
        if (checkDuplicate) { return res.status(409).send({ status: false, msg: "This fullName already exists please provide another fullName." }) }


        //=====================Validation of logoLink=====================//

        if (!checkValid(logoLink)) return res.status(400).send({ status: false, message: "Please Provide valid Input" })
        if (!(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/).test(logoLink)) return res.status(400).send({ status: false, msg: "Please Use Correct Characters in logoLink" })

        //=====================creating College data in DB=====================//
        let college = await collegeModel.create(data)
        let guru={name:college.name, fullName:college.fullName, logoLink:college.logoLink, isDeleted:college.isDeleted}
        return res.status(201).send({ status: true, msg: guru })
    }

    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }



}


//=====================Exporting Funcitons=====================//

module.exports = { createColleges }








