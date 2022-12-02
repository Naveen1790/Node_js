const express = require("express");

const router = express.Router();

const employeesController = require("../../controllers/employeeController");
const roles_list = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .get(employeesController.getAllEmployees)
  .post(
    verifyRoles(roles_list.Admin, roles_list.Editor),
    employeesController.createNewEmployee
  )
  .put(
    verifyRoles(roles_list.Admin, roles_list.Editor),
    employeesController.updateEmployee
  )
  .delete(verifyRoles(roles_list.Admin), employeesController.deleteEmployee);

router.route("/:id").get(employeesController.getEmployee);

module.exports = router;
