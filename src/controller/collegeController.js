let collegeModel= require("../models/collegeModel")
let internModel= require("../models/internModel")




const createColleges= async function(req,res){

    let data=req.body

    if (Object.keys(data).length == 0) {
        return res.status(400).send({ Error: "Body should be not empty" })
    }

    let { name, fullName, logoLink } = data
    if(!(name && fullName && logoLink)){
        res.status(400).send({status:false,msg:"Mandatory fields are required"})
    }


    let college=await collegeModel.create(data)
     return  res.status(201).send({status:true,msg:college})
    

}

let collegeDetails = async function (req, res ) {
    try {
        if (req.query.collegeName) {
            let college = await collegeModel.findOne({name: req.query.collegeName, isDeleted: false})
            if(!college) {
                res.status(404).send({status: false, msg: "college name not found"})
            } else {
                let collegeData = {
                    name: college.name,
                    fullName: college.fullName,
                    logoLink: college.logoLink
                }
                let interns = await internModel.find({collegeId: college._id, isDeleted: false }, "-collegeId -isDeleted -createdAt -updatedAt -__v").sort({createdAt: -1})
                if(interns) {
                    collegeData.interns = interns
                }
                res.status(201).send({ status: true, data: collegeData})
            }
        } else {
            res.status(400).send({ status: false, msg: "College name not present"})
        }
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports={createColleges}
module.exports.collegeDetails = collegeDetails







