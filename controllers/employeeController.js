// const data = {
//   employees: require("../model/employees.json"),
//   setEmployees: function (data) {
//     this.employees = data;
//   },
// };

const Employee = require("../model/Employee");

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find();
  if (!employees)
    return res.status(204).json({ message: "No Employees found" });
  res.json(employees);
};

const createNewEmployee = async (req, res) => {
  if (!req?.body?.firstname || !req?.body?.lastname) {
    return res.status(400).json({ message: "First & Last names are required" });
  }

  try {
    const result = await Employee.create({
      firstname: firstname,
      lastname: lastname,
    });

    res.status(201).json(result);
  } catch (err) {
    console.log(err);
  }
  // console.log(req.body);
  // const newEmployee = {
  //   id: data.employees[data.employees.length - 1].id + 1 || 1,
  //   firstname: req.body.firstname,
  //   lastname: req.body.lastname,
  // };

  // if (!newEmployee.firstname || !newEmployee.lastname) {
  //   return res.status(400).json({ message: "First & Last names are required" });
  // }

  // data.setEmployees([...data.employees, newEmployee]);
  // res.status(201).json(data.employees);
};

const updateEmployee = async (req, res) => {
  // console.log(req);
  // const employee = data.employees.find(
  //   (emp) => emp.id === parseInt(req.body.id)
  // );
  // if (!employee) {
  //   return res
  //     .status(400)
  //     .json({ message: `Employee Id ${req.body.id} not found` });
  // }
  // if (req.body.firstname) employee.firstname = req.body.firstname;
  // if (req.body.lastname) employee.lastname = req.body.lastname;
  // const filteredArray = data.employees.filter(
  //   (emp) => emp.id !== parseInt(req.body.id)
  // );
  // const unsortedArray = [...filteredArray, employee];
  // data.setEmployees(
  //   unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  // );
  // res.json(data.employees);
  if (!req.body?.id) {
    return res.status(400).json({ message: "Id parameter is required" });
  }
  const employees = await Employee.findOne({ _id: req.body.id }).exec();
  if (!employees)
    return res
      .status(204)
      .json({ message: `No emplyee matches Id ${req.body.id}` });
  if (req.body?.firstname) employee.firstname = req.body.firstname;
  if (req.body?.lastname) employee.lastname = req.body.lastname;

  const result = await employee.save();
  res.json(result);
};

const deleteEmployee = async (req, res) => {
  // const employee = data.employees.find(
  //   (emp) => emp.id === parseInt(req.body.id)
  // );
  // if (!employee) {
  //   return res
  //     .status(400)
  //     .json({ message: `Employee Id ${req.body.id} not found` });
  // }
  // const filteredArray = data.employees.filter(
  //   (emp) => emp.id !== parseInt(req.body.id)
  // );
  // data.setEmployees([...filteredArray]);
  // res.json(data.employees);
  if (!req.body?.id) {
    return res.status(400).json({ message: "Id parameter is required" });
  }
  const employee = await Employee.findOne({ _id: req.body.id }).exec();
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No emplyee matches Id ${req.body.id}` });
  }
  const result = await employee.deleteOne({ _id: req.body.id });
  res.json(result);
};

const getEmployee = async (req, res) => {
  // const employee = data.employees.find(
  //   (emp) => emp.id === parseInt(req.params.id)
  // );
  // if (!employee) {
  //   return res
  //     .status(400)
  //     .json({ message: `Employee Id ${req.params.id} not found` });
  // }
  // res.json(employee);
  if (!req.params?.id) {
    return res.status(400).json({ message: "Id parameter is required" });
  }
  const employee = await Employee.findOne({ __id: req.params.id }).exec();
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No emplyee matches Id ${req.params.id}` });
  }
  res.json(employee);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
