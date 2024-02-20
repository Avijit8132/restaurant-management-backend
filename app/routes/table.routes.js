const e = require("express");
const { fetchUser } = require("../middleware/fetchuser.js");
const Table = require("../models/table.model.js"); 
const permissions = require("../constants/permissions.js");

module.exports = app => {
  
  const { body, validationResult } = require('express-validator');
  var router = require("express").Router();

  // Create a new Table
  router.post("/", fetchUser, [
    body('name', 'Please enter name').isLength({ min: 1 }),
    body('occupancy', 'Please enter occupancy').isLength({ min: 1 }),
    body('status', 'Please enter status').isLength({ min: 1 }),
    // Add validation rules for other fields as needed
  ] ,
  async (req, res)=>{
    // Check permissions
    // const permission = req.userinfo.permissions.find(el => el.name === permissions.CREATE_TABLE);
    // if (!permission) return res.status(401).json({errors : "Unauthorized"});

    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({errors : errors.array()});
    }
    
    Table.init(req.userinfo.tenantcode);
    const tableRec = await Table.create(req.body,  req.userinfo.id);
    
    if(!tableRec){
      return res.status(400).json({errors : "Bad Request"});
    }

    return res.status(201).json(tableRec);
  });

  // Get All Tables
  router.get("/", fetchUser, async (req, res)=>{
    // Check permissions
    // const permission = req.userinfo.permissions.find(el => el.name === permissions.VIEW_TABLES);
    // if (!permission) return res.status(401).json({errors : "Unauthorized"});

    Table.init(req.userinfo.tenantcode);
    const tables = await Table.findAll();
    if(tables){
      res.status(200).json(tables);
    }else{
      res.status(400).json({errors : "No data"});
    }
  });

  // Get Table by ID
  router.get("/:id", fetchUser, async (req, res)=>{
    // Check permissions
    // const permission = req.userinfo.permissions.find(el => el.name === permissions.VIEW_TABLE);
    // if (!permission) return res.status(401).json({errors : "Unauthorized"});

    Table.init(req.userinfo.tenantcode);
    const table = await Table.findById(req.params.id);
    if(table){
      res.status(200).json(table);
    }else{
      res.status(400).json({errors : "No data"});
    }
  });


  // router.put("/:id", fetchUser, async (req, res) => {
  //   try {
  //     //Check permissions
  //     const permission = req.userinfo.permissions.find(el => el.name === permissions.EDIT_TABLE || el.name === permissions.MODIFY_ALL);
  //     if (!permission) return res.status(401).json({errors : "Unauthorized"});

  //     const { occupancy, status, description } = req.body;
  //     const errors = [];
  //     const tableRec = {};
  //     if (req.body.hasOwnProperty("name")) { tableRec.occupancy = occupancy; }
  //     if (req.body.hasOwnProperty("occupancy")) { tableRec.occupancy = occupancy; }
  //     if (req.body.hasOwnProperty("status")) { tableRec.status = status; }
  //     if (req.body.hasOwnProperty("description")) { tableRec.description = description; }

  //     if (errors.length !== 0) {
  //       return res.status(400).json({errors : errors});
  //     }

  //     Table.init(req.userinfo.tenantcode);
  //     const result = await Table.updateById(req.params.id, tableRec, req.userinfo.id);

  //     if (result) {
  //       return res.status(200).json(result);
  //     } else {
  //       return res.status(404).json({errors: "Record not found"});
  //     }
  //   } catch (error) {
  //     res.status(500).json({errors : error});
  //   }
  // });

  router.put("/:id", fetchUser, [
    body('name', 'Please enter name').isLength({ min: 1 }),
    body('occupancy', 'Please enter occupancy').isLength({ min: 1 }),
    body('status', 'Please enter status').isLength({ min: 1 }),
    // Add validation rules for other fields as needed
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    Table.init(req.userinfo.tenantcode);
    const updatedTable = await Table.updateById(req.params.id, req.body, req.userinfo.id);
    if (!updatedTable) {
      return res.status(400).json({ errors: "Bad Request" });
    }
  
    return res.status(200).json(updatedTable);
  });


  // Delete Table by ID
  router.delete("/:id", fetchUser, async (req, res) => {
    // Check permissions
    // const permission = req.userinfo.permissions.find(el => el.name === permissions.DELETE_TABLE);
    // if (!permission) return res.status(401).json({errors : "Unauthorized"});

    Table.init(req.userinfo.tenantcode);
    const result = await Table.deleteTable(req.params.id);
    if(!result)
      return res.status(200).json({"success" : false, "message"  : "No record found"});
    
    res.status(200).json({"success" : true, "message"  : "Successfully Deleted"});
  });

  app.use(process.env.BASE_API_URL + '/api/tables', router);
};
