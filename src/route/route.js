//=====================Importing Module and Packages=====================//
const express = require('express');
const router = express.Router();
const {createColleges}=require("../controller/collegeController")
const {createIntern}=require("../controller/internController")
const {collegeDetails}=require("../controller/collegeController")



router.post("/functionup/colleges",createColleges)
router.post("/functionup/interns",createIntern)
router.get("/functionup/collegeDetails", collegeDetails)


//=====================Module Export=====================//
module.exports = router;   