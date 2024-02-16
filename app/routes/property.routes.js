/**
 * Handles all incoming request for /api/properties endpoint
 * DB table for this public.property
 * Model used here is property.model.js
 * SUPPORTED API ENDPOINTS
 *              GET     /api/properties
 *              GET     /api/properties/:id
 *              POST    /api/properties
 *              PUT     /api/properties/:id
 *              DELETE  /api/properties/:id
 *
 * @author      Aslam Bari
 * @date        Feb, 2023
 * @copyright   www.ibirdsservices.com
 */

const e = require("express");
const { fetchUser } = require("../middleware/fetchuser.js");
const Property = require("../models/property.model.js");
const permissions = require("../constants/permissions.js");
const global = require("../constants/global.js");

module.exports = (app) => {
  const { body, validationResult } = require("express-validator");

  var router = require("express").Router();

  // ..........................................Create property..........................................
  router.post(
    "/",
    fetchUser,
    [
      // body('name', 'Please enter name').isLength({ min: 1 }),
      // body('type', 'Please enter type').isLength({ min: 1 }),
      // body('phone', 'Please enter valid phone (10 digit)').isLength({ min: 10 })
    ],

    async (req, res) => {
      // Check permissions
      const permission = req.userinfo.permissions.find(
        (el) =>
          el.name === permissions.EDIT_LEAD ||
          el.name === permissions.MODIFY_ALL
      );
      if (!permission) return res.status(401).json({ errors: "Unauthorized" });

      const {
        name,
        street,
        city,
        state,
        country,
        pincode,
        area,
        contactid,
        ownerid,
        description,
        areameasure,
        superbuiltuparea,
        floor,
        transactiontype,
        propertybase,
        googlelocation,
        possessionstatus,
        propertytype,
        vertical,
        areatofrom,
        furnishedstatus,
        typeofclient,
        verticaltype,
        subverticaltype,
        arearangein,
        areato,
        propertycreateddate,
        leaseexpirationdate,
        possessiondate,
        officestate,
        officecity,
        officestreet,
        officecountry,
        officepincode,
        areadetails,
        heightdetails,
        noofdocksvalue,
        noofwashroomsvalue,
        openareaunit,
        openareavalue,
        closeareaunit,
        closeareavalue,
        rentalunit,
        rentalvalue
      } = req.body;

      const errors = [];
      const propertyRec = {};


      //console.log("fnm", req.body.hasOwnProperty("salutation"));
      if (req.body.hasOwnProperty("area") && req.body.area != "") {
        propertyRec.area = area;
      }
      if (
        req.body.hasOwnProperty("arearangein") &&
        req.body.arearangein != ""
      ) {
        propertyRec.arearangein = arearangein;
      }
      if (req.body.hasOwnProperty("areato") && req.body.areato != "") {
        propertyRec.areato = areato;
      }
      if (req.body.hasOwnProperty("code") && req.body.code != "") {
        propertyRec.code = code;
      }
      if (req.body.hasOwnProperty("name") && req.body.name != "") {
        propertyRec.name = name;
      }
      if (req.body.hasOwnProperty("type") && req.body.type != "") {
        propertyRec.type = type;
      }
      if (
        req.body.hasOwnProperty("description") &&
        req.body.description != ""
      ) {
        propertyRec.description = description;
      }
      if (req.body.hasOwnProperty("email") && req.body.email != "") {
        propertyRec.email = email;
      }
      if (req.body.hasOwnProperty("phone") && req.body.phone != "") {
        propertyRec.phone = phone;
      }
      if (req.body.hasOwnProperty("street") && req.body.street != "") {
        propertyRec.street = street;
      }
      if (req.body.hasOwnProperty("city") && req.body.city != "") {
        propertyRec.city = city;
      }
      if (req.body.hasOwnProperty("state") && req.body.state != "") {
        propertyRec.state = state;
      }
      if (req.body.hasOwnProperty("pincode") && req.body.pincode != "") {
        propertyRec.pincode = pincode;
      }
      if (req.body.hasOwnProperty("country") && req.body.country != "") {
        propertyRec.country = country;
      }
      if (req.body.hasOwnProperty("vidurl") && req.body.vidurl != "") {
        propertyRec.vidurl = vidurl;
      }
      if (req.body.hasOwnProperty("projectid") && req.body.projectid != "") {
        propertyRec.projectid = projectid;
      }
      if (req.body.hasOwnProperty("ownerid") && req.body.ownerid != "") {
        propertyRec.ownerid = ownerid;
      }
      if (
        req.body.hasOwnProperty("areameasure") &&
        req.body.areameasure != ""
      ) {
        propertyRec.areameasure = areameasure;
      }
      if (req.body.hasOwnProperty("showonweb") && req.body.showonweb != "") {
        propertyRec.showonweb = showonweb;
      }
      if (req.body.hasOwnProperty("cost") && req.body.cost != "") {
        propertyRec.cost = cost;
      }
      if (req.body.hasOwnProperty("status") && req.body.status != "") {
        propertyRec.status = status;
      }
      if (
        req.body.hasOwnProperty("propertyfor") &&
        req.body.propertyfor != ""
      ) {
        propertyRec.propertyfor = propertyfor;
      }
      if (
        req.body.hasOwnProperty("legalstatus") &&
        req.body.legalstatus != ""
      ) {
        propertyRec.legalstatus = legalstatus;
      }
      if (req.body.hasOwnProperty("contactid") && req.body.contactid != "") {
        propertyRec.contactid = contactid;
      }
      if (
        req.body.hasOwnProperty("superbuiltuparea") &&
        req.body.superbuiltuparea != ""
      ) {
        propertyRec.superbuiltuparea = superbuiltuparea;
      }
      if (req.body.hasOwnProperty("floor") && req.body.floor != "") {
        propertyRec.floor = floor;
      }
      if (
        req.body.hasOwnProperty("transactiontype") &&
        req.body.transactiontype != ""
      ) {
        propertyRec.transactiontype = transactiontype;
      }
      if (
        req.body.hasOwnProperty("propertybase") &&
        req.body.propertybase != ""
      ) {
        propertyRec.propertybase = propertybase;
      }
      if (
        req.body.hasOwnProperty("googlelocation") &&
        req.body.googlelocation != ""
      ) {
        propertyRec.googlelocation = googlelocation;
      }
      if (
        req.body.hasOwnProperty("possessionstatus") &&
        req.body.possessionstatus != ""
      ) {
        propertyRec.possessionstatus = possessionstatus;
      }
      if (
        req.body.hasOwnProperty("propertytype") &&
        req.body.propertytype != ""
      ) {
        propertyRec.propertytype = propertytype;
      }
      if (req.body.hasOwnProperty("vertical") && req.body.vertical != "") {
        propertyRec.vertical = vertical;
      }
      if (req.body.hasOwnProperty("areatofrom") && req.body.areatofrom != "") {
        propertyRec.areatofrom = areatofrom;
      }
      if (
        req.body.hasOwnProperty("furnishedstatus") &&
        req.body.furnishedstatus != ""
      ) {
        propertyRec.furnishedstatus = furnishedstatus;
      }
      if (
        req.body.hasOwnProperty("typeofclient") &&
        req.body.typeofclient != ""
      ) {
        propertyRec.typeofclient = typeofclient;
      }
      if (
        req.body.hasOwnProperty("verticaltype") &&
        req.body.verticaltype != ""
      ) {
        propertyRec.verticaltype = verticaltype;
      }
      if (
        req.body.hasOwnProperty("subverticaltype") &&
        req.body.subverticaltype != ""
      ) {
        propertyRec.subverticaltype = subverticaltype;
      }
      if (
        req.body.hasOwnProperty("propertycreateddate") &&
        req.body.propertycreateddate != ""
      ) {
        propertyRec.propertycreateddate = propertycreateddate;
      }
      if (
        req.body.hasOwnProperty("leaseexpirationdate") &&
        req.body.leaseexpirationdate != ""
      ) {
        propertyRec.leaseexpirationdate = leaseexpirationdate;
      }
      if (
        req.body.hasOwnProperty("possessiondate") &&
        req.body.possessiondate != ""
      ) {
        propertyRec.possessiondate = possessiondate;
      }
      if (
        req.body.hasOwnProperty("officestate") &&
        req.body.officestate != ""
      ) {
        propertyRec.officestate = officestate;
      }
      if (
        req.body.hasOwnProperty("officestreet") &&
        req.body.officestreet != ""
      ) {
        propertyRec.officestreet = officestreet;
      }
      if (req.body.hasOwnProperty("officecity") && req.body.officecity != "") {
        propertyRec.officecity = officecity;
      }
      if (
        req.body.hasOwnProperty("officecountry") &&
        req.body.officecountry != ""
      ) {
        propertyRec.officecountry = officecountry;
      }
      if (
        req.body.hasOwnProperty("officepincode") &&
        req.body.officepincode != ""
      ) {
        propertyRec.officepincode = officepincode;
      }
      //
      if (
        req.body.hasOwnProperty("noofdocksvalue") &&
        req.body.noofdocksvalue != ""
      ) {
        propertyRec.noofdocksvalue = noofdocksvalue;
      }
      if (
        req.body.hasOwnProperty("noofwashroomsvalue") &&
        req.body.noofwashroomsvalue != ""
      ) {
        propertyRec.noofwashroomsvalue = noofwashroomsvalue;
      }
      if (
        req.body.hasOwnProperty("openareaunit") &&
        req.body.openareaunit != ""
      ) {
        propertyRec.openareaunit = openareaunit;
      }
      if (
        req.body.hasOwnProperty("openareavalue") &&
        req.body.openareavalue != ""
      ) {
        propertyRec.openareavalue = openareavalue;
      }
      if (
        req.body.hasOwnProperty("closeareaunit") &&
        req.body.closeareaunit != ""
      ) {
        propertyRec.closeareaunit = closeareaunit;
      }
      if (
        req.body.hasOwnProperty("closeareavalue") &&
        req.body.closeareavalue != ""
      ) {
        propertyRec.closeareavalue = closeareavalue;
      }
      if (
        req.body.hasOwnProperty("rentalunit") &&
        req.body.rentalunit != ""
      ) {
        propertyRec.rentalunit = rentalunit;
      }
      if (
        req.body.hasOwnProperty("rentalvalue") &&
        req.body.rentalvalue != ""
      ) {
        propertyRec.rentalvalue = rentalvalue;
      }
      


      console.log("property rec -", propertyRec);


      Property.init(req.userinfo.tenantcode);
  
      const propertyDetailsRec = areadetails
      const heightdetailsRec = heightdetails
       const result = await Property.create(propertyRec, propertyDetailsRec,heightdetailsRec, req.userinfo.id);


      //  const propertyDetailsRec =[...areadetails, ...heightdetails];
      // const result = await Property.create(propertyRec, propertyDetailsRec, req.userinfo.id);


      if (!result) {
        return res.status(400).json({ errors: "Bad Request" });
      }

      return res.status(201).json(result);
    }
  );

  // ..........................................Create property from facebook..........................................
  router.post("/fb", [], async (req, res) => {
    if (!req.body) res.status(400).json({ errors: "Bad Request" });

    try {
      Property.init(req.userinfo.tenantcode);
      const propertyRec = await Property.createFB(
        req.body,
        global.SYSTEM_DEFAULT_USER
      );

      console.log("propertyRec:", propertyRec);
      if (!propertyRec) {
        return res.status(400).json({ errors: "Bad Request" });
      }

      return res.status(201).json(propertyRec);
    } catch (error) {
      console.log("===", JSON.stringify(error));
      return res.status(400).json({ errors: error });
    }
  });

  // ......................................Get All property........................................
  // router.get("/", fetchUser, async (req, res) => {
  //   //Check permissions

  //   console.log("permissions.VIEW_LEAD:", permissions.VIEW_LEAD);
  //   const permission = req.userinfo.permissions.find(
  //     (el) =>
  //       el.name === permissions.VIEW_LEAD ||
  //       el.name === permissions.MODIFY_ALL ||
  //       el.name === permissions.VIEW_ALL
  //   );
  //   if (!permission) return res.status(401).json({ errors: "Unauthorized" });
  //   Property.init(req.userinfo.tenantcode);
  //   const properties = await Property.findAll();
  //   //console.log('properties:', properties);
  //   if (properties) {
  //     res.status(200).json(properties);
  //   } else {
  //     res.status(400).json({ errors: "No data" });
  //   }
  // });

  router.get("/", fetchUser, async (req, res) => {
    try {
      // Check permissions
      console.log("permissions.VIEW_LEAD:", permissions.VIEW_LEAD);
      const permission = req.userinfo.permissions.find(
        (el) =>
          el.name === permissions.VIEW_LEAD ||
          el.name === permissions.MODIFY_ALL ||
          el.name === permissions.VIEW_ALL
      );
  
      if (!permission) return res.status(401).json({ errors: "Unauthorized" });
  
      Property.init(req.userinfo.tenantcode);
      const properties = await Property.findAll();
      
      if (properties) {
        res.status(200).json(properties);
      } else {
        res.status(404).json({ errors: "No properties found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ errors: "Internal Server Error" });
    }
  });

  // .....................................Get Property by Id........................................
  router.get("/:id", fetchUser, async (req, res) => {
    try {
      // Check permissions
      const permission = req.userinfo.permissions.find(
        (el) =>
          el.name === permissions.VIEW_LEAD ||
          el.name === permissions.MODIFY_ALL ||
          el.name === permissions.VIEW_ALL
      );
      if (!permission) return res.status(401).json({ errors: "Unauthorized" });
  
      Property.init(req.userinfo.tenantcode);
      let resultProperty = await Property.findById(req.params.id);
  
      if (resultProperty) {
        return res.status(200).json(resultProperty);
      } else {
        return res.status(200).json({ success: false, message: "No record found" });
      }
    } catch (error) {
      console.log("System Error:", error);
      return res.status(400).json({ success: false, message: error });
    }
  });
  

  //Get Leads by Property Id

  router.get("/:id/relatedleads/", fetchUser, async (req, res) => {
    try {
      console.log("fetchUser");
      //Check permissions
      const permission = req.userinfo.permissions.find(
        (el) =>
          // el.name === permissions.VIEW_CONTACT ||
          el.name === permissions.MODIFY_ALL || el.name === permissions.VIEW_ALL
      );

      if (!permission) return res.status(401).json({ errors: "Unauthorized" });
      Property.init(req.userinfo.tenantcode);
      let resultCon = await Property.findLeadByPropertyId(req.params.id);
      if (resultCon) {
        return res.status(200).json(resultCon);
      } else {
        return res
          .status(200)
          .json({ success: false, message: "No record found" });
      }
    } catch (error) {
      console.log("error", error);
      return res.status(400).json({ success: false, message: error });
    }
  });

  //......................................Get Property by OwnerId.................................
  /*router.get("/:id/*", fetchUser, async (req, res)=>{
    try {
      console.log('--------');
      //Check permissions
      const permission = req.userinfo.permissions.find(el => el.name === permissions.VIEW_LEAD
                                                          || el.name === permissions.MODIFY_ALL
                                                          || el.name === permissions.VIEW_ALL);
      if (!permission) return res.status(401).json({errors : "Unauthorized"});
      Property.init(req.userinfo.tenantcode);
      let resultProperty = await Property.findByOwnerId(req.params.id);
      if(resultProperty){
        return res.status(200).json(resultProperty);
      }else{
        return res.status(200).json({"success" : false, "message"  : "No record found"});
      }
    } catch (error) {
      console.log('System Error:', error);
      return res.status(400).json({"success" : false, "message"  : error});
    }
  });*/

  //......................................Get Active Property by PropertyId.................................
  router.get("/:id/active", fetchUser, async (req, res) => {
    try {
      //Check permissions
      const permission = req.userinfo.permissions.find(
        (el) =>
          el.name === permissions.MODIFY_ALL || el.name === permissions.VIEW_ALL
      );
      if (!permission) return res.status(401).json({ errors: "Unauthorized" });
      let resultCon = await Property.findActiveProperty(req.params.id);
      if (resultCon) {
        return res.status(200).json(resultCon);
      } else {
        return res
          .status(200)
          .json({ success: false, message: "No record found" });
      }
    } catch (error) {
      return res.status(400).json({ success: false, message: error });
    }
  });

  //.........................................Update property .....................................

  router.put("/:id", fetchUser, async (req, res) => {
    try {
      // Check permissions
      const permission = req.userinfo.permissions.find(
        (el) =>
          el.name === permissions.EDIT_LEAD ||
          el.name === permissions.MODIFY_ALL
      );
  
      if (!permission) return res.status(401).json({ errors: "Unauthorized" });
  
      // Extract properties from request body
      const {
        name,
        street,
        city,
        state,
        country,
        pincode,
        area,
        contactid,
        ownerid,
        description,
        areameasure,
        superbuiltuparea,
        floor,
        transactiontype,
        propertybase,
        googlelocation,
        possessionstatus,
        propertytype,
        vertical,
        areatofrom,
        furnishedstatus,
        typeofclient,
        verticaltype,
        subverticaltype,
        arearangein,
        areato,
        propertycreateddate,
        leaseexpirationdate,
        possessiondate,
        officestate,
        officecity,
        officestreet,
        officecountry,
        officepincode,
        noofdocksvalue,
        noofwashroomsvalue,
        openareaunit,
        openareavalue,
        closeareaunit,
        closeareavalue,
        rentalunit,
        rentalvalue,
        areadetails,
        heightdetails
      } = req.body;

   // Extract propertydetails from the request body
      const propertydetails = req.body.areadetails || [];
      const errors = [];
      const propertyRec = {};

      //console.log("fnm", req.body.hasOwnProperty("salutation"));
      if (req.body.hasOwnProperty("area") && req.body.area != "") {
        propertyRec.area = area;
      }
      if (
        req.body.hasOwnProperty("arearangein") &&
        req.body.arearangein != ""
      ) {
        propertyRec.arearangein = arearangein;
      }
      if (req.body.hasOwnProperty("areato") && req.body.areato != "") {
        propertyRec.areato = areato;
      }
      if (req.body.hasOwnProperty("code") && req.body.code != "") {
        propertyRec.code = code;
      }
      if (req.body.hasOwnProperty("name") && req.body.name != "") {
        console.log('name *==>',name);
        propertyRec.name = name;
        console.log(' propertyRec.name *==>', propertyRec.name);
      }
      if (req.body.hasOwnProperty("type") && req.body.type != "") {
        propertyRec.type = type;
      }
      if (
        req.body.hasOwnProperty("description") &&
        req.body.description != ""
      ) {
        propertyRec.description = description;
      }
      if (req.body.hasOwnProperty("email") && req.body.email != "") {
        propertyRec.email = email;
      }
      if (req.body.hasOwnProperty("phone") && req.body.phone != "") {
        propertyRec.phone = phone;
      }
      if (req.body.hasOwnProperty("street") && req.body.street != "") {
        propertyRec.street = street;
      }
      if (req.body.hasOwnProperty("city") && req.body.city != "") {
        propertyRec.city = city;
      }
      if (req.body.hasOwnProperty("state") && req.body.state != "") {
        propertyRec.state = state;
      }
      if (req.body.hasOwnProperty("pincode") && req.body.pincode != "") {
        propertyRec.pincode = pincode;
      }
      if (req.body.hasOwnProperty("country") && req.body.country != "") {
        propertyRec.country = country;
      }
      if (req.body.hasOwnProperty("vidurl") && req.body.vidurl != "") {
        propertyRec.vidurl = vidurl;
      }
      if (req.body.hasOwnProperty("projectid") && req.body.projectid != "") {
        propertyRec.projectid = projectid;
      }
      if (req.body.hasOwnProperty("ownerid") && req.body.ownerid != "") {
        propertyRec.ownerid = ownerid;
      }
      if (
        req.body.hasOwnProperty("areameasure") &&
        req.body.areameasure != ""
      ) {
        propertyRec.areameasure = areameasure;
      }
      if (req.body.hasOwnProperty("showonweb") && req.body.showonweb != "") {
        propertyRec.showonweb = showonweb;
      }
      if (req.body.hasOwnProperty("cost") && req.body.cost != "") {
        propertyRec.cost = cost;
      }
      if (req.body.hasOwnProperty("status") && req.body.status != "") {
        propertyRec.status = status;
      }
      if (
        req.body.hasOwnProperty("propertyfor") &&
        req.body.propertyfor != ""
      ) {
        propertyRec.propertyfor = propertyfor;
      }
      if (
        req.body.hasOwnProperty("legalstatus") &&
        req.body.legalstatus != ""
      ) {
        propertyRec.legalstatus = legalstatus;
      }
      if (req.body.hasOwnProperty("contactid") && req.body.contactid != "") {
        propertyRec.contactid = contactid;
      }
      if (
        req.body.hasOwnProperty("superbuiltuparea") &&
        req.body.superbuiltuparea != ""
      ) {
        propertyRec.superbuiltuparea = superbuiltuparea;
      }
      if (req.body.hasOwnProperty("floor") && req.body.floor != "") {
        propertyRec.floor = floor;
      }
      if (
        req.body.hasOwnProperty("transactiontype") &&
        req.body.transactiontype != ""
      ) {
        propertyRec.transactiontype = transactiontype;
      }
      if (
        req.body.hasOwnProperty("propertybase") &&
        req.body.propertybase != ""
      ) {
        propertyRec.propertybase = propertybase;
      }
      if (
        req.body.hasOwnProperty("googlelocation") &&
        req.body.googlelocation != ""
      ) {
        propertyRec.googlelocation = googlelocation;
      }
      if (
        req.body.hasOwnProperty("possessionstatus") &&
        req.body.possessionstatus != ""
      ) {
        propertyRec.possessionstatus = possessionstatus;
      }
      if (
        req.body.hasOwnProperty("propertytype") &&
        req.body.propertytype != ""
      ) {
        propertyRec.propertytype = propertytype;
      }
      if (req.body.hasOwnProperty("vertical") && req.body.vertical != "") {
        propertyRec.vertical = vertical;
      }
      if (req.body.hasOwnProperty("areatofrom") && req.body.areatofrom != "") {
        propertyRec.areatofrom = areatofrom;
      }
      if (
        req.body.hasOwnProperty("furnishedstatus") &&
        req.body.furnishedstatus != ""
      ) {
        propertyRec.furnishedstatus = furnishedstatus;
      }
      if (
        req.body.hasOwnProperty("typeofclient") &&
        req.body.typeofclient != ""
      ) {
        propertyRec.typeofclient = typeofclient;
      }
      if (
        req.body.hasOwnProperty("verticaltype") &&
        req.body.verticaltype != ""
      ) {
        propertyRec.verticaltype = verticaltype;
      }
      if (
        req.body.hasOwnProperty("subverticaltype") &&
        req.body.subverticaltype != ""
      ) {
        propertyRec.subverticaltype = subverticaltype;
      }
      if (
        req.body.hasOwnProperty("propertycreateddate") &&
        req.body.propertycreateddate != ""
      ) {
        propertyRec.propertycreateddate = propertycreateddate;
      }
      if (
        req.body.hasOwnProperty("leaseexpirationdate") &&
        req.body.leaseexpirationdate != ""
      ) {
        propertyRec.leaseexpirationdate = leaseexpirationdate;
      }
      if (
        req.body.hasOwnProperty("possessiondate") &&
        req.body.possessiondate != ""
      ) {
        propertyRec.possessiondate = possessiondate;
      }
      if (
        req.body.hasOwnProperty("officestate") &&
        req.body.officestate != ""
      ) {
        propertyRec.officestate = officestate;
      }
      if (req.body.hasOwnProperty("officecity") && req.body.officecity != "") {
        propertyRec.officecity = officecity;
      }
      if (
        req.body.hasOwnProperty("officestreet") &&
        req.body.officestreet != ""
      ) {
        propertyRec.officestreet = officestreet;
      }
      if (
        req.body.hasOwnProperty("officecountry") &&
        req.body.officecountry != ""
      ) {
        propertyRec.officecountry = officecountry;
      }
      if (
        req.body.hasOwnProperty("officepincode") &&
        req.body.officepincode != ""
      ) {
        propertyRec.officepincode = officepincode;
      }
      //
      if (
        req.body.hasOwnProperty("noofdocksvalue") &&
        req.body.noofdocksvalue != ""
      ) {
        propertyRec.noofdocksvalue = noofdocksvalue;
      }
      if (
        req.body.hasOwnProperty("noofwashroomsvalue") &&
        req.body.noofwashroomsvalue != ""
      ) {
        propertyRec.noofwashroomsvalue = noofwashroomsvalue;
      }
      if (
        req.body.hasOwnProperty("openareaunit") &&
        req.body.openareaunit != ""
      ) {
        propertyRec.openareaunit = openareaunit;
      }
      if (
        req.body.hasOwnProperty("openareavalue") &&
        req.body.openareavalue != ""
      ) {
        propertyRec.openareavalue = openareavalue;
      }
      if (
        req.body.hasOwnProperty("closeareaunit") &&
        req.body.closeareaunit != ""
      ) {
        propertyRec.closeareaunit = closeareaunit;
      }
      if (
        req.body.hasOwnProperty("closeareavalue") &&
        req.body.closeareavalue != ""
      ) {
        propertyRec.closeareavalue = closeareavalue;
      }
      if (
        req.body.hasOwnProperty("rentalunit") &&
        req.body.rentalunit != ""
      ) {
        propertyRec.rentalunit = rentalunit;
      }
      if (
        req.body.hasOwnProperty("rentalvalue") &&
        req.body.rentalvalue != ""
      ) {
        propertyRec.rentalvalue = rentalvalue;
      }


      Property.init(req.userinfo.tenantcode);
  
      // Call the update function with updatedProperty and areadetails
      const result = await Property.updateById(
        req.params.id,
        propertyRec,
        areadetails,
        heightdetails,
        req.userinfo.id
      );
  
      if (result) {
        return res.status(200).json(result);
      } else {
        return res.status(404).json({ success: false, message: "No record found" });
      }
    } catch (error) {
      console.log("error:", error);
      res.status(400).json({ errors: error });
    }
  });

  
  // .................................................Delete Property............................
  router.delete("/:id", fetchUser, async (req, res) => {
    try {
      // Check permissions
      const permission = req.userinfo.permissions.find(
        (el) =>
          el.name === permissions.DELETE_LEAD ||
          el.name === permissions.MODIFY_ALL
      );
      if (!permission) return res.status(401).json({ errors: "Unauthorized" });

      Property.init(req.userinfo.tenantcode);

      // Call the deleteProperty function to delete property and related details
      const result = await Property.deleteProperty(req.params.id);

      if (result === "Success") {
        return res.status(200).json({ success: true, message: "Successfully Deleted" });
      } else {
        return res.status(400).json({ success: false, message: "No record found" });
      }
    } catch (error) {
      console.error("Error during deletion:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });


  
  // Delete all Tutorials
  //router.delete("/", properties.deleteAll);

  //public property for website
  router.get("/public/:tenantcode", async (req, res) => {
    console.log("req.params.tenantcode", req.params.tenantcode);
    Property.init(req.params.tenantcode);
    const properties = await Property.findAllPublicProperty();
    //console.log('properties:', properties);
    if (properties) {
      res.status(200).json(properties);
    } else {
      res.status(400).json({ errors: "No data" });
    }
  });

  app.use(process.env.BASE_API_URL + "/api/properties", router);
};
