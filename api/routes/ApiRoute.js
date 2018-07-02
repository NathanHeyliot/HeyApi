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
        .get(dashboard.get_main);

    /*
    * ----------------------------------------
    * API ROUTE
    * ----------------------------------------
     */


//routes des payloads
    app.route('/payloads')
        .get(payApi.list_payload)   // OK
        .post(payApi.create_payload); // OK

    app.route('/payloads/id/:appId')
        .get(payApi.read_payload) //OK ---> must be the ID of the payload
        .put(payApi.update_payload) // temporaire voué a disparaitre!
        .delete(payApi.delete_payload);

    app.route('/payloads/deviceId/:DeviceId')
        .get(payApi.get_paybydevice); //OK ---> must be the DEVICE ID of the paylaod



//routes des devices
    app.route('/devices')
        .get(deviceApi.list_device) // OK
        .post(deviceApi.create_device);

    app.route('/devices/id/:appId')
        .get(deviceApi.read_device)  // OK ---> must be the ID of the device
        .put(deviceApi.update_device)
        .delete(deviceApi.delete_device);

    app.route('/devices/group/:GroupId')
        .get(deviceApi.list_group_devices); // OK --> must be the group ID of the device

    app.route('/devices/type/:DeviceType')
        .get(deviceApi.list_bytype); // OK --> must be the device type of the device


    //VIEW OF DEVICES

    app.route('/devices/vue/')
        .get(deviceApi.render_device);

    app.route('/devices/vue/id/:appId')
        .get(deviceApi.render_detail);

    //VIEW OF DEVICES



//routes des groupes
    app.route('/groups')
        .get(groupApi.list_group) // OK --> list of groups
        .post(groupApi.create_group);

    app.route('/groups/id/:appId')
        .delete(groupApi.delete_group)
        .get(groupApi.read_group) // OK --> return properties of a group
        .put (groupApi.update_group);


//routes Organisations
    app.route('/organisations')
        .get(orgApi.list_organisation) // OK --> list of all organisations
        .post(orgApi.crate_organisation);

    app.route('/organisations/id/:appId')
        .put(orgApi.update_organisation)
        .delete(orgApi.delete_organisation);


    //routes types
    app.route('/devicestypes')
        .get(typeApi.list_devicetypes) // OK --> list of devices types
        .post(typeApi.create_devicetypes);

    app.route('/devicestypes/name/:Name')
        .delete(typeApi.delete_devicestypes);

    //TODO ajouter les routes User avec login
};