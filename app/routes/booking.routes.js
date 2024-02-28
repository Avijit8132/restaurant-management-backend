const express = require("express");
const { fetchUser } = require("../middleware/fetchuser.js");
const Booking = require("../models/booking.model.js");
const permissions = require("../constants/permissions.js");

module.exports = app => {
  const { body, validationResult } = require("express-validator");

  const router = express.Router();

  // Create a new Booking
  router.post("/", fetchUser, [
    body("tableid", "Please provide a table ID").notEmpty(),
    body("contactid", "Please provide a contact ID").notEmpty(),
    body("numberofperson", "Please provide the number of persons").notEmpty().isNumeric(),
  ], async (req, res) => {
    // Check permissions
    const permission = req.userinfo.permissions.find(el => el.name === permissions.CREATE_BOOKING || el.name === permissions.MODIFY_ALL);
    if (!permission) return res.status(401).json({ errors: "Unauthorized" });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    Booking.init(req.userinfo.tenantcode);
    const booking = await Booking.create(req.body, req.userinfo.id);
    console.log("req.body---",req.body);
    if (!booking) {
      return res.status(400).json({ errors: "Bad Request" });
    }

    return res.status(201).json(booking);
  });

  // Get All Bookings
  router.get("/", fetchUser, async (req, res) => {
    // Check permissions
    const permission = req.userinfo.permissions.find(el => el.name === permissions.VIEW_BOOKING || el.name === permissions.VIEW_ALL || el.name === permissions.MODIFY_ALL);
    if (!permission) return res.status(401).json({ errors: "Unauthorized" });

    Booking.init(req.userinfo.tenantcode);
    const bookings = await Booking.findAll();
    
    if (bookings.length > 0) {
      res.status(200).json(bookings);
    } else {
      res.status(404).json({ errors: "No data found" });
    }
  });

  // Get Booking by ID
  router.get("/:id", fetchUser, async (req, res) => {
    // Check permissions
    const permission = req.userinfo.permissions.find(el => el.name === permissions.VIEW_BOOKING || el.name === permissions.VIEW_ALL || el.name === permissions.MODIFY_ALL);
    if (!permission) return res.status(401).json({ errors: "Unauthorized" });

    Booking.init(req.userinfo.tenantcode);
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      return res.status(200).json(booking);
    } else {
      return res.status(404).json({ errors: "Booking not found" });
    }
  });

  // Update Booking
  // router.put("/:id", fetchUser, async (req, res) => {
  //   // Check permissions
  //   const permission = req.userinfo.permissions.find(el => el.name === permissions.EDIT_BOOKING || el.name === permissions.MODIFY_ALL);
  //   if (!permission) return res.status(401).json({ errors: "Unauthorized" });

  //   const bookingData = req.body;
  //   Booking.init(req.userinfo.tenantcode);
  //   const updatedBooking = await Booking.updateById(req.params.id, bookingData, req.userinfo.id);

  //   if (updatedBooking) {
  //     return res.status(200).json({ success: true, message: "Booking updated successfully" });
  //   } else {
  //     return res.status(404).json({ errors: "Booking not found" });
  //   }
  // });
  router.put("/:id", fetchUser, async (req, res) => {
    // Check permissions
    const permission = req.userinfo.permissions.find(el => el.name === permissions.EDIT_BOOKING || el.name === permissions.MODIFY_ALL);
    if (!permission) return res.status(401).json({ errors: "Unauthorized" });

    const bookingData = req.body;
    Booking.init(req.userinfo.tenantcode);
    const updatedBooking = await Booking.updateById(req.params.id, bookingData, req.userinfo.id);

    if (updatedBooking) {
        return res.status(200).json({ success: true, message: "Booking updated successfully", booking: updatedBooking });
    } else {
        return res.status(404).json({ errors: "Booking not found" });
    }
});

  // Delete Booking
  router.delete("/:id", fetchUser, async (req, res) => {
    // Check permissions
    const permission = req.userinfo.permissions.find(el => el.name === permissions.DELETE_BOOKING || el.name === permissions.MODIFY_ALL);
    if (!permission) return res.status(401).json({ errors: "Unauthorized" });

    Booking.init(req.userinfo.tenantcode);
    const result = await Booking.deleteBooking(req.params.id);

    if (result) {
      return res.status(200).json({ success: true, message: "Booking deleted successfully" });
    } else {
      return res.status(404).json({ errors: "Booking not found" });
    }
  });

  app.use(process.env.BASE_API_URL + '/api/bookings', router);
};
