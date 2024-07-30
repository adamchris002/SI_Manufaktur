const productionRoutes = require("express").Router();
const {ProductionController} = require("../controllers")

//get
productionRoutes.get("/penyerahanBarangSiap", ProductionController.getPenyerahanBarang)

//post

//put

//delete

module.exports = productionRoutes;