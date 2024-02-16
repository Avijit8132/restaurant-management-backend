/**
 * Handles all incoming request for /api/leads endpoint
 * DB table for this public.lead
 * Model used here is lead.model.js
 * SUPPORTED API ENDPOINTS
 *              GET     /api/leads
 *              GET     /api/leads/:id
 *              POST    /api/leads
 *              PUT     /api/leads/:id
 *              DELETE  /api/leads/:id
 *
 * @author      Aslam Bari
 * @date        Feb, 2023
 * @copyright   www.ibirdsservices.com
 */

const e = require("express")
const { fetchUser } = require("../middleware/fetchuser.js")
const Lead = require("../models/lead.model.js")
const Auth = require("../models/auth.model.js")
const permissions = require("../constants/permissions.js")
const global = require("../constants/global.js")
const Mailer = require("../models/mail.model.js")
const Notification = require('../models/notification.model.js')

module.exports = (app) => {
  const { body, validationResult } = require("express-validator")

  var router = require("express").Router()

  // ..........................................Create lead..........................................
  router.post(
    "/",
    fetchUser,
    [
      // body("firstname", "Please enter firstname").isLength({ min: 1 }),
      // body("lastname", "Please enter lastname").isLength({ min: 1 }),
      // body("phone", "Please enter valid phone (10 digit)").isLength({
      //   min: 10,
      // }),
    ],

    async (req, res) => {
      //Check permissions
      const permission = req.userinfo.permissions.find(
        (el) =>
          el.name === permissions.EDIT_LEAD ||
          el.name === permissions.MODIFY_ALL
      )
      if (!permission) return res.status(401).json({ errors: "Unauthorized" })

      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }
      Lead.init(req.userinfo.tenantcode)
      const leadRec = await Lead.create(req.body, req.userinfo.id)

      console.log("leadRec:", leadRec)
      if (!leadRec) {
        return res.status(400).json({ errors: "Bad Request" })
      }

      res.status(201).json(leadRec)

      let newLead = await Lead.findById(leadRec.id)
      console.log("newLead:", newLead)
      if (newLead.owneremail) {
        let email = Lead.prepareMailForNewLead(newLead)
        let fromEmail = Object.keys(JSON.parse(process.env.FROM_EMAIL))[0]
        console.log('fromEmail :>> ', fromEmail);
        console.log("email:", email)
        // Mailer.sendLeadAlertEmail(fromEmail || 'emailtesting.ibirdsservices@gmail.com', email);
      }
      if(newLead.ownerid){
        console.log('ownerid is not null, calling create Notificatoin');
        Notification.createNotificationRecord('lead_create', newLead, req.userinfo.id, app.get('socket'), req.userinfo.tenantcode)
        Notification.createNotificationRecord('lead_assign', newLead, req.userinfo.id, app.get('socket'), req.userinfo.tenantcode)
      }

      //return res.status(201).json(leadRec);
    }
  )

  // // ..........................................Create lead from facebook..........................................
  // router.post("/fb", [], async (req, res) => {
  //   if (!req.body) res.status(400).json({ errors: "Bad Request" });

  //   try {
  //     Lead.init(req.userinfo.tenantcode);
  //     const leadRec = await Lead.createFB(req.body, global.SYSTEM_DEFAULT_USER);

  //     console.log("leadRec:", leadRec);
  //     if (!leadRec) {
  //       return res.status(400).json({ errors: "Bad Request" });
  //     }

  //     return res.status(201).json(leadRec);
  //   } catch (error) {
  //     console.log("===", JSON.stringify(error));
  //     return res.status(400).json({ errors: error });
  //   }
  // });

  // ......................................Get All lead........................................
  router.get("/", fetchUser, async (req, res) => {
    //Check permissions
    console.log("permissions.VIEW_LEAD:", permissions.VIEW_LEAD)
    const permission = req.userinfo.permissions.find(
      (el) =>
        el.name === permissions.VIEW_LEAD ||
        el.name === permissions.MODIFY_ALL ||
        el.name === permissions.VIEW_ALL
    )
    if (!permission) return res.status(401).json({ errors: "Unauthorized" })
    Lead.init(req.userinfo.tenantcode)
    const leads = await Lead.findAll()
    //console.log('leads:', leads);
    if (leads) {
      res.status(200).json(leads)
    } else {
      res.status(400).json({ errors: "No data" })
    }
  })

  // .....................................Get Lead by Id........................................
  router.get("/:id", fetchUser, async (req, res) => {
    try {
      //Check permissions
      const permission = req.userinfo.permissions.find(
        (el) =>
          el.name === permissions.VIEW_LEAD ||
          el.name === permissions.MODIFY_ALL ||
          el.name === permissions.VIEW_ALL
      )
      if (!permission) return res.status(401).json({ errors: "Unauthorized" })
      Lead.init(req.userinfo.tenantcode)
      let resultLead = await Lead.findById(req.params.id)
      if (resultLead) {
        return res.status(200).json(resultLead)
      } else {
        return res
          .status(200)
          .json({ success: false, message: "No record found" })
      }
    } catch (error) {
      console.log("System Error:", error)
      return res.status(400).json({ success: false, message: error })
    }
  })

  //......................................Get Lead by OwnerId.................................
  router.get("/:id/*", fetchUser, async (req, res) => {
    try {
      console.log("--------")
      //Check permissions
      const permission = req.userinfo.permissions.find(
        (el) =>
          el.name === permissions.VIEW_LEAD ||
          el.name === permissions.MODIFY_ALL ||
          el.name === permissions.VIEW_ALL
      )
      if (!permission) return res.status(401).json({ errors: "Unauthorized" })
      Lead.init(req.userinfo.tenantcode)
      let resultLead = await Lead.findByOwnerId(req.params.id)
      if (resultLead) {
        return res.status(200).json(resultLead)
      } else {
        return res
          .status(200)
          .json({ success: false, message: "No record found" })
      }
    } catch (error) {
      console.log("System Error:", error)
      return res.status(400).json({ success: false, message: error })
    }
  })

  //.........................................Update lead .....................................
  router.put("/:id", fetchUser, async (req, res) => {
    try {
      //Check permissions
      const permission = req.userinfo.permissions.find(
        (el) =>
          el.name === permissions.EDIT_LEAD ||
          el.name === permissions.MODIFY_ALL
      )
      if (!permission) return res.status(401).json({ errors: "Unauthorized" })

      const {
        firstname,
        lastname,
        salutation,
        designation,
        email,
        phone,
        alternatephone,
        office,
        clientstreet,
        clientcity,
        clientstate,
        clientcountry,
        clientpincode,
        clientcalloption,
        clientcalloptionemail,
        clientcalloptionname,
        clientcalloptionmobile,
        clientcalloptiondate,
        clientcalloptionremark,
        clientcalloptionratepersqfeet,
        clientcalloptionbrokerage,
        transactiontype,
        typeofclient,
        vertical,
        verticaltype,
        subverticaltype,
        zone,
        state,
        city,
        areavaluein,
        areafrom,
        areato,
        numberofcarortruckparking,
        type,
        otherlocations,
        otherdetails,
        budgetrangein,
        budgetrangefrom,
        budgetrangeto,
        areaorlocationbrief,
        carpetarea,
        heightrangein,
        heightfrom,
        heightto,
        floorfrom,
        floorto,
        completiondate,
        frontage,
        currentleadcity,
        actions,
        ilid,
        client,
        currentleadstate,
        area,
        acmanagername,
        memberoffice,
        acmanageremail,
        acmanagerphone,
        ilcloseddate,
        ilcreateddate,
        comments,
        ownerid,
        leadsource,
        leadstage,
        thirdparty,
        company,
        frontagein,
        acmanagerdetails,
        leadcreateddate,
        noofdocksvalue,
        noofwashroomsvalue,
        openareaunit,
        openareavalue,
        closeareaunit,
        closeareavalue,
        rentalunit,
        rentalvalue,
        clienttype,
        areadetails,
        heightdetails
      } = req.body
      const errors = []
      const leadRec = {}

      //console.log("fnm", req.body.hasOwnProperty("salutation"));
      if (req.body.hasOwnProperty("firstname")) {
        leadRec.firstname = firstname
      }
      if (req.body.hasOwnProperty("lastname")) {
        leadRec.lastname = lastname
      }
      if (req.body.hasOwnProperty("salutation")) {
        leadRec.salutation = salutation
      }
      if (req.body.hasOwnProperty("designation")) {
        leadRec.designation = designation
      }
      if (req.body.hasOwnProperty("email")) {
        leadRec.email = email
      }
      if (req.body.hasOwnProperty("phone")) {
        leadRec.phone = phone
      }
      if (req.body.hasOwnProperty("alternatephone")) {
        leadRec.alternatephone = alternatephone
      }
      if (req.body.hasOwnProperty("office")) {
        leadRec.office = office
      }
      if (req.body.hasOwnProperty("clientstreet")) {
        leadRec.clientstreet = clientstreet
      }
      if (req.body.hasOwnProperty("clientcity")) {
        leadRec.clientcity = clientcity
      }
      if (req.body.hasOwnProperty("clientstate")) {
        leadRec.clientstate = clientstate
      }
      if (req.body.hasOwnProperty("clientcountry")) {
        leadRec.clientcountry = clientcountry
      }
      if (req.body.hasOwnProperty("clientpincode")) {
        leadRec.clientpincode = clientpincode
      }
      if (req.body.hasOwnProperty("clientcalloption")) {
        leadRec.clientcalloption = clientcalloption
      }
      if (req.body.hasOwnProperty("clientcalloptionemail")) {
        leadRec.clientcalloptionemail = clientcalloptionemail
      }
      if (req.body.hasOwnProperty("clientcalloptionname")) {
        leadRec.clientcalloptionname = clientcalloptionname
      }
      if (req.body.hasOwnProperty("clientcalloptionmobile")) {
        leadRec.clientcalloptionmobile = clientcalloptionmobile
      }
      if (req.body.hasOwnProperty("clientcalloptiondate")) {
        leadRec.clientcalloptiondate = clientcalloptiondate
      }
      if (req.body.hasOwnProperty("clientcalloptionremark")) {
        leadRec.clientcalloptionremark = clientcalloptionremark
      }
      if (req.body.hasOwnProperty("clientcalloptionratepersqfeet")) {
        leadRec.clientcalloptionratepersqfeet = clientcalloptionratepersqfeet
      }
      if (req.body.hasOwnProperty("clientcalloptionbrokerage")) {
        leadRec.clientcalloptionbrokerage = clientcalloptionbrokerage
      }
      if (req.body.hasOwnProperty("transactiontype")) {
        leadRec.transactiontype = transactiontype
      }
      if (req.body.hasOwnProperty("typeofclient")) {
        leadRec.typeofclient = typeofclient
      }
      if (req.body.hasOwnProperty("vertical")) {
        leadRec.vertical = vertical
      }
      if (req.body.hasOwnProperty("verticaltype")) {
        leadRec.verticaltype = verticaltype
      }
      if (req.body.hasOwnProperty("subverticaltype")) {
        leadRec.subverticaltype = subverticaltype
      }
      if (req.body.hasOwnProperty("zone")) {
        leadRec.zone = zone
      }
      if (req.body.hasOwnProperty("state")) {
        leadRec.state = state
      }
      if (req.body.hasOwnProperty("city")) {
        leadRec.city = city
      }
      if (req.body.hasOwnProperty("areavaluein")) {
        leadRec.areavaluein = areavaluein
      }
      if (req.body.hasOwnProperty("areafrom")) {
        leadRec.areafrom = areafrom
      }
      if (req.body.hasOwnProperty("areato")) {
        leadRec.areato = areato
      }
      if (req.body.hasOwnProperty("numberofcarortruckparking")) {
        leadRec.numberofcarortruckparking = numberofcarortruckparking
      }
      if (req.body.hasOwnProperty("type")) {
        leadRec.type = type
      }
      if (req.body.hasOwnProperty("otherlocations")) {
        leadRec.otherlocations = otherlocations
      }
      if (req.body.hasOwnProperty("otherdetails")) {
        leadRec.otherdetails = otherdetails
      }
      if (req.body.hasOwnProperty("budgetrangein")) {
        leadRec.budgetrangein = budgetrangein
      }
      if (req.body.hasOwnProperty("budgetrangefrom")) {
        leadRec.budgetrangefrom = budgetrangefrom
      }
      if (req.body.hasOwnProperty("budgetrangeto")) {
        leadRec.budgetrangeto = budgetrangeto
      }
      if (req.body.hasOwnProperty("areaorlocationbrief")) {
        leadRec.areaorlocationbrief = areaorlocationbrief
      }
      if (req.body.hasOwnProperty("carpetarea")) {
        leadRec.carpetarea = carpetarea
      }
      if (req.body.hasOwnProperty("heightrangein")) {
        leadRec.heightrangein = heightrangein
      }
      if (req.body.hasOwnProperty("heightfrom")) {
        leadRec.heightfrom = heightfrom
      }
      if (req.body.hasOwnProperty("heightto")) {
        leadRec.heightto = heightto
      }
      if (req.body.hasOwnProperty("floorfrom")) {
        leadRec.floorfrom = floorfrom
      }
      if (req.body.hasOwnProperty("floorto")) {
        leadRec.floorto = floorto
      }
      if (req.body.hasOwnProperty("completiondate")) {
        leadRec.completiondate = completiondate
      }
      if (req.body.hasOwnProperty("frontage")) {
        leadRec.frontage = frontage
      }
      if (req.body.hasOwnProperty("currentleadcity")) {
        leadRec.currentleadcity = currentleadcity
      }
      if (req.body.hasOwnProperty("actions")) {
        leadRec.actions = actions
      }
      if (req.body.hasOwnProperty("ilid")) {
        leadRec.ilid = ilid
      }
      if (req.body.hasOwnProperty("client")) {
        leadRec.client = client
      }
      if (req.body.hasOwnProperty("currentleadstate")) {
        leadRec.currentleadstate = currentleadstate
      }
      if (req.body.hasOwnProperty("area")) {
        leadRec.area = area
      }
      if (req.body.hasOwnProperty("acmanagername")) {
        leadRec.acmanagername = acmanagername
      }
      if (req.body.hasOwnProperty("memberoffice")) {
        leadRec.memberoffice = memberoffice
      }
      if (req.body.hasOwnProperty("acmanageremail")) {
        leadRec.acmanageremail = acmanageremail
      }
      if (req.body.hasOwnProperty("acmanagerphone")) {
        leadRec.acmanagerphone = acmanagerphone
      }
      if (req.body.hasOwnProperty("ilcloseddate")) {
        leadRec.ilcloseddate = ilcloseddate
      }
      if (req.body.hasOwnProperty("ilcreateddate")) {
        leadRec.ilcreateddate = ilcreateddate
      }
      if (req.body.hasOwnProperty("comments")) {
        leadRec.comments = comments
      }
      if (req.body.hasOwnProperty("ownerid")) {
        leadRec.ownerid = ownerid
      }
      if (req.body.hasOwnProperty("leadsource")) {
        leadRec.leadsource = leadsource
      }
      if (req.body.hasOwnProperty("leadstage")) {
        leadRec.leadstage = leadstage
      }
      if (req.body.hasOwnProperty("thirdparty")) {
        leadRec.thirdparty = thirdparty
      }
      if (req.body.hasOwnProperty("company")) {
        leadRec.company = company
      }
      if (req.body.hasOwnProperty("frontagein")) {
        leadRec.frontagein = frontagein
      }
      if (req.body.hasOwnProperty("acmanagerdetails")) {
        leadRec.acmanagerdetails = acmanagerdetails
      }
      if (req.body.hasOwnProperty("leadcreateddate")) {
        leadRec.leadcreateddate = leadcreateddate
      }
          //
         if (req.body.hasOwnProperty("noofdocksvalue")) {
            leadRec.noofdocksvalue = noofdocksvalue;
         }
          if ( req.body.hasOwnProperty("noofwashroomsvalue")) {
            leadRec.noofwashroomsvalue = noofwashroomsvalue;
          }         
          if ( req.body.hasOwnProperty("openareaunit")) {
            leadRec.openareaunit = openareaunit;
          }
          if (req.body.hasOwnProperty("openareavalue")) {
            leadRec.openareavalue = openareavalue;
          }
          if (req.body.hasOwnProperty("closeareaunit")) {
            leadRec.closeareaunit = closeareaunit;
          }
          if (req.body.hasOwnProperty("closeareavalue")) {
            leadRec.closeareavalue = closeareavalue;
          }
          if (
            req.body.hasOwnProperty("rentalunit")) {
            leadRec.rentalunit = rentalunit;
          }
          if (
            req.body.hasOwnProperty("rentalvalue")) {
            leadRec.rentalvalue = rentalvalue;
          }
          if (
            req.body.hasOwnProperty("clienttype")) {
            leadRec.clienttype = clienttype;
          }
      
      
      

      // if (errors.length !== 0) {
      //   return res.status(400).json({ errors: errors });
      // }
      Lead.init(req.userinfo.tenantcode)
      let resultLead = await Lead.findById(req.params.id)

      //console.log("res", resultLead);

      if (resultLead) {
        //console.log('req.userinfo:', req.userinfo);
        let updateResult = await Lead.updateById(
          req.params.id,
          leadRec,
          areadetails,
          heightdetails,
          req.userinfo.id
        )
        console.log("updateResult *==>", updateResult)
        console.log("file: lead.routes.js:483 - router.put - resultLead - ", resultLead)
        if (resultLead) {
          leadRec['id'] = req.params.id;
          if(resultLead.ownerid != leadRec.ownerid){
            console.log('ownerid is changed, calling create Notificatoin');
            Notification.createNotificationRecord('lead_reassign', leadRec, req.userinfo.id, app.get('socket'), req.userinfo.tenantcode)
          }
          if(resultLead.leadstage != leadRec.leadstage){
            console.log('leadstage is changed, calling create Notificatoin');
            Notification.createNotificationRecord('lead_stage', leadRec, req.userinfo.id, app.get('socket'), req.userinfo.tenantcode)
          }
          return res
            .status(200)
            .json({ success: true, message: "Record updated successfully" })
        }
        return res.status(200).json(resultLead)
      } else {
        return res
          .status(200)
          .json({ success: false, message: "No record found" })
      }
    } catch (error) {
      console.log("error:", error)
      res.status(400).json({ errors: error })
    }
  })

  // .................................................Delete Lead............................
  router.delete("/:id", fetchUser, async (req, res) => {
    //Check permissions
    const permission = req.userinfo.permissions.find(
      (el) =>
        el.name === permissions.DELETE_LEAD ||
        el.name === permissions.MODIFY_ALL
    )
    if (!permission) return res.status(401).json({ errors: "Unauthorized" })
    Lead.init(req.userinfo.tenantcode)
    const result = await Lead.deleteLead(req.params.id)
    if (!result)
      return res
        .status(200)
        .json({ success: false, message: "No record found" })

    res.status(400).json({ success: true, message: "Successfully Deleted" })
  })

  // // ..........................................Interested Property Create Lead FROM WEBSITE..........................................
  // router.post("/interested/propertylead/:tenantcode", [], async (req, res) => {
  //   if (!req.body) res.status(400).json({ errors: "Bad Request" });

  //   try {
  //     Lead.init(req.params.tenantcode);
  //     const leadRec = await Lead.interestedPropertyCreateLead(req.body);

  //     console.log("leadRec:", leadRec);
  //     if (!leadRec) {
  //       return res.status(400).json({ errors: "Bad Request" });
  //     }

  //     res.status(201).json(leadRec);
  //     let newLead = await Lead.findById(leadRec.id);
  //     if (newLead.owneremail) {
  //       let email = Lead.prepareMailForNewLead(newLead);
  //       console.log("email:", email);
  //       // const userRec = await Auth.findById(req.userinfo.id);
  //       let fromAdd = `System Admin <demo@indicrm.io>`;
  //       Mailer.sendEmail(newLead.owneremail, email.subject, email.body, fromAdd);
  //     }

  //   } catch (error) {
  //     console.log("===", JSON.stringify(error));
  //     return res.status(400).json({ errors: error });
  //   }
  // });

  // Delete all Tutorials
  //router.delete("/", leads.deleteAll);

  app.use(process.env.BASE_API_URL + "/api/leads", router)
}
