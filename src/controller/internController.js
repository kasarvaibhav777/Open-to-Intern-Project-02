//=====================Importing Module and Packages=====================//
let collegeModel = require("../models/collegeModel")
let internModel = require("../models/internModel")


//=====================Function to check type of key value=====================//
let checkValid = function (value) {
    if (typeof value == "undefined" || typeof value == "number" || value.length == 0 || typeof value == null) {
        return false
    } else if (typeof value == "string") {
        return true
    }
    return true
}



//===============================Create Interns==============================================//
let createIntern = async function (req, res) {
    try {
        let data = req.body

        if (Object.keys(data).length == 0) {
          return  res.status(400).send({ status: false, msg: "Body input is necessary" })
        }

        let { name, email, mobile, collegeName } = data

        //=====================check Mandatory keys=====================//

        if (!(name && email && mobile && collegeName)) {
           return  res.status(400).send({ status: false, msg: "Mandatory fields are required" })
        }

        //=====================Validation of name=====================//

        if (!checkValid(name)) return res.status(400).send({ status: false, message: "Please Provide valid Input" })
        if (!(/^[a-zA-z]+([\s][a-zA-Z]+)+$/).test(name)) return res.status(400).send({ status: false, msg: "Please Use Correct Characters in name" })
        let duplicateN = await internModel.findOne({ name: name })
        if (duplicateN) { return res.status(409).send({ status: false, msg: "This name already exists please provide another name." }) }


        //=====================Validation of EmailID=====================//

        if (!checkValid(email)) return res.status(400).send({ status: false, message: "please provide correct type of email." })
        if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/).test(email)) { return res.status(400).send({ status: false, msg: "Please provide valid Email" }) }
        let duplicateEmail = await internModel.findOne({ email: email })
        if (duplicateEmail) { return res.status(409).send({ status: false, msg: "This EmailID already exists please provide another EmailID." }) }


        //=====================Validation of mobile=====================//

        if (!checkValid(mobile)) return res.status(400).send({ status: false, message: "Please Provide valid Input" })
        if (!  (/^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/).test(mobile)) return res.status(400).send({ status: false, msg: "Please Use Correct Digits in mobile" })
        let duplicateMobile = await internModel.findOne({ mobile: mobile })
        if (duplicateMobile) { return res.status(409).send({ status: false, msg: "This mobile already exists please provide another mobile." }) }


        //=====================Validation of collegeName=====================//

        if (!checkValid(collegeName)) return res.status(400).send({ status: false, message: "Please Provide valid Input" })
        if (!(/^[a-z]+$\b/).test(collegeName)) return res.status(400).send({ status: false, msg: "Please Use Correct Characters in collegeName" })


        //=====================check presence of collegeName in DB=====================//

        let clg = await collegeModel.findOne({ isDeleted: false, name: collegeName })
        if (!clg) {return res.status(404).send({ status: false, msg: "this college is not found" }) }

        
        let obj = { ...data, collegeId: clg._id }

         //=====================creating Intern data in DB=====================//
        let internC = await internModel.create(obj)


        //=====================response data=====================//

        let intern ={isDeleted:internC.isDeleted, name:internC.name, email:internC.email, mobile:internC.mobile,collegeId:internC.collegeId}

        return res.status(201).send({ status: true, data: intern })

      
    } 
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}




//===============================Fetch Collge Data =============================================//

let collegeDetails = async function (req, res) {
    try {
        let collegeName = req.query.collegeName

        //=====================check Mandatory Query=====================//
     
        if(!collegeName){ return res.status(400).send({status:false, msg:"CollegeName Query is Mandatory"})}


        //=====================DB call to find college =====================//

        let getC = await collegeModel.findOne({ name: collegeName, isDeleted: false })
        if (!getC) {return res.status(400).send({ status: false, msg: "No College Found with Given CollegeName" }) }

        //=====================Assigning Necessary key Values from college doc=====================//

        let data = { name: getC.name, fullName: getC.fullName, logoLink: getC.logoLink }


        //=====================Db call to find intern with same college=====================//

        let intern = await internModel.find({ collegeId: getC._id, isDeleted: false }).select('_id name email mobile')
        if (!intern) {return res.status(404).send({ status: false, msg: "No Intern Available in this College" }) }
        else {
        //=====================Assigning intern data in college data=====================//

            data.intern = intern
            return res.status(200).send({ status: true, CollegeData: data })

        }
       
       

    }

    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }

}

//=====================Exporting Funcitons=====================//

module.exports = { createIntern, collegeDetails }
