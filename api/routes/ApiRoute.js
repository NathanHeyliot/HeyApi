'use strict'

module.exports = function (app) {
    let payApi = require("../controllers/PayloadsController");
    let deviceApi = require("../controllers/DeviceController");
    let groupApi = require("../controllers/GroupController");
    let orgApi = require("../controllers/OrganisationController");
    let typeApi = require("../controllers/TypesController");
    let dashboard = require("../controllers/dashboardController");
    let express = require('express');

    /*
    * --------------------------------
    * DASH BOARD ROUTE
    * --------------------------------
    */

    app.route('/mainPage')
        .get(dashboard.get_main); //the main Page view

    app.route('/devices/vue/')
        .get(deviceApi.render_device); //the devices list view

    app.route('/devices/vue/id/:appId')
        .get(deviceApi.render_detail); //view used to show informations about a device

    /*
    * ----------------------------------------
    * API ROUTE
    * ----------------------------------------
     */


    /*
    * AVANT DE METTRE L APPLICATION SUR LE SERVEUR, IL EST CONSEILLER DE PURGER LA BDD
     */


    /*
    *--------------------------
    * PAYLOAD ROUTER
    * -------------------------
     */
    app.route('/payloads')
        .get(payApi.list_payload)   // OK
        .post(payApi.create_payload); // OK
      //  .delete(payApi.delete_all_payloads); // OK

    app.route('/payloads/id/:appId')
        .get(payApi.read_payload) //OK ---> must be the ID of the payload
        .delete(payApi.delete_payload); //OK --> must be the ID of the payload

    app.route('/payloads/deviceId/:DeviceId')
        .get(payApi.get_paybydevice); //OK ---> must be the DEVICE ID of the paylaod



    /*
    *--------------------------
    * DEVICE ROUTER
    * -------------------------
     */
    app.route('/devices')
        .get(deviceApi.list_device) // OK
        .post(deviceApi.create_device); // OK --> fonctionne mais besoin de drop la database au préalable sous risque de conflit de Index Access_ID
     //   .delete(deviceApi.delete_all_devices); //used to delete all devices in mongoDB

    app.route('/devices/id/:appId')
        .get(deviceApi.read_device)  // OK ---> must be the ID of the device
        .put(deviceApi.update_device) //OK --> used to update a specified device
        .delete(deviceApi.delete_device); //OK --> used to delete a specified device

    app.route('/devices/group/:GroupId')
        .get(deviceApi.list_group_devices); // OK --> must be the group ID of the device

    app.route('/devices/type/:DeviceType')
        .get(deviceApi.list_bytype); // OK --> must be the device type of the device


    /*
    *--------------------------
    * GROUPS ROUTER
    * -------------------------
     */
    app.route('/groups')
        .get(groupApi.list_group) // OK --> list of groups
        .post(groupApi.create_group); //OK --> create a group -- group id must be unique
     //   .delete(groupApi.delete_all_groups); // OK --> delete all groups


    app.route('/groups/id/:appId')
        .delete(groupApi.delete_group) // OK --> must be a _id of the named group
        .get(groupApi.read_group) // OK --> return properties of a group
        .put (groupApi.update_group); //OK


    /*
    *--------------------------
    * ORGANISATIONS ROUTER
    * -------------------------
     */
    app.route('/organisations')
        .get(orgApi.list_organisation) // OK --> list of all organisations
        .post(orgApi.create_organisation); //OK --> create an organisation
     //   .delete(orgApi.delete_all_organisations); // OK --> delete all organisations

    app.route('/organisations/id/:appId')
        .put(orgApi.update_organisation) //OK --> used to update an organisation information
        .get(orgApi.get_organisation) //OK --> get information about a group
        .delete(orgApi.delete_organisation); //OK --> used to delete an specified organisation

    /*
    *--------------------------
    * DEVICES TYPES ROUTER
    * -------------------------
     */
    app.route('/devicestypes')
        .get(typeApi.list_devicetypes) // OK --> list of devices types
        .post(typeApi.create_devicetypes); //OK --> create a device type
       // .delete(typeApi.delete_all_devicestypes); // OK --> delete all devices types

    app.route('/devicestypes/name/:Name')
        .delete(typeApi.delete_devicestypes) //OK --> delete a specified device types
        .get(typeApi.information_devicestypes); //OK --> get information about a specified device
};