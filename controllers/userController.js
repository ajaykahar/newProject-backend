const express = require('express');
const router = express.Router();
const shortid = require("shortid");
const EmployeeModel = require('./../models/Employee')
const ProjectModel=require('./../models/Project')
const cors=require('cors')




router.post('/signup',cors(), (req, res) => {
  EmployeeModel.findOne({ email: req.body.email }, function (err, existingUser) {
    if (err) {
      console.log(err);
      return next(err);
    } else if (existingUser) {
      console.log("Existing")
      return res.status(422).json({ error: "Email is already in use" });
    } else {
      // console.log(req.body.cart)
      const employee = new EmployeeModel({
        employeeId: shortid.generate(),
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: "Employee"
      });

      employee.save(function (err, newEmployee) {
        if (err) {
          res.send(err);
        } else {
          console.log("Successfull")
          let apiResponse = {
            status: 200,
            message: "SignUp successfull",
            data: newEmployee,
          }
          res.send(apiResponse)
        }
      });
    }
  });
})

router.post('/login',cors(), (req, res) => {
  if (req.body.email) {
    EmployeeModel.findOne({ email: req.body.email }, (err, user) => {
      if (err) {
        res.send(err);
      } else if (!user) {
        let apiResponse = {
          status: 404,
          message: "No user Found",
        }
        res.send(apiResponse);
      } else {
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (err) {
            res.send(err);
          } else if (!isMatch) {
            let apiResponse = {
              status: 400,
              message: "Wrong Password",
            }
            res.send(apiResponse);
          } else {
            if (req.body.email == "manager@gmail.com") {
              let apiResponse = {
                status: 999,
                message: "login successfull",
                data: user,
              }
              res.send(apiResponse)
            } else {
              let apiResponse = {
                status: 200,
                message: "login successfull",
                data: user,
              }
              res.send(apiResponse)
            }
          }
        });
      }
    });
  } else {
    let apiResponse = {
      status: 400,
      message: "Email missingl",
    }
    res.send(apiResponse);
  }
})

router.get('/employee/all',cors(), (req, res) => {
  EmployeeModel.find({ _id: { $ne: "5f8535411820be6390db8f07" } })
    .select('-__v  -_id')
    .lean()
    .exec((err, result) => {
      if (err) {
        let apiResponse = {
          message: "Failed to load All employee",
          status: 500
        }
        res.send(apiResponse);
      } else if (!result) {
        let apiResponse = {
          message: "No employee Details Found",
          status: 404
        }
        res.send(apiResponse);
      } else {
        let apiResponse = {
          message: "All employee details found",
          status: 200,
          data: result
        }
        res.send(apiResponse);
      }
    })
})


router.post("/assign/task",cors(), (req, res) => {

  let projectId = Math.floor(100000 + Math.random() * 900000);

  let newTask = new ProjectModel({
    projectId: projectId,
    employeeId:req.body.employeeId,
    task: req.body.task,
    deadline: req.body.deadline,
  })

  newTask.save((err, result) => {
    if (err) {
      console.log(err)
      let apiResponse = {
        message:"Failed to assign task",
        status: 500,
      }
      res.send(apiResponse);
    } else {
      let apiResponse = {
        message: "task assigned successfully",
        status:200,
      }
      res.send(apiResponse);
    }
  })
})

router.post('/allTask',cors(), (req, res) => {
  ProjectModel.find({employeeId:req.body.employeeId})
    .select('-__v  -_id')
    .lean()
    .exec((err, result) => {
      if (err) {
        let apiResponse = {
          message: "Failed to load All task",
          status: 500
        }
        res.send(apiResponse);
      } else if (!result) {
        let apiResponse = {
          message: "No task Details Found",
          status: 404
        }
        res.send(apiResponse);
      } else {
        let apiResponse = {
          message: "All task details found",
          status: 200,
          data: result
        }
        res.send(apiResponse);
      }
    })
})

router.post('/update/status',cors(),(req,res)=>{
  ProjectModel.findOneAndUpdate({projectId:req.body.projectId},{status:req.body.status})
  .then(
    data=>{
      res.send(data);
    },err=>{
      console.log(err);
    }
  )
})




module.exports = router;