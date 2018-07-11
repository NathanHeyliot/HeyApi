'use strict'

module.exports = function (app, route_dev, auth_activated) {
    let payApi = require("../controllers/PayloadsController");
    let deviceApi = require("../controllers/DeviceController");
    let groupApi = require("../controllers/GroupController");
    let orgApi = require("../controllers/OrganisationController");
    let typeApi = require("../controllers/TypesController");
    let dashboard = require("../controllers/dashboardController");
    let jwt_auth = require("../controllers/AuthController");
    let userApi = require("../controllers/UserController");
    let userGroupApi = require("../controllers/UserGroupController");
    let LocalisationApi = require("../controllers/LocalisationController");

    var cors = require('cors');

    app.use(cors());

    /*
    * VAR FOR DEVELOPPEMENT MODE
     */

    if(auth_activated)
        app.use(jwt_auth.middle_token);

    if(route_dev) {
        app.route('/payloads')
            .delete(payApi.delete_all_payloads); // OK

        app.route('/devices')
           .delete(deviceApi.delete_all_devices); //used to delete all devices in mongoDB

        app.route('/devicesgroups')
           .delete(groupApi.delete_all_groups); // OK --> delete all groups

        app.route('/organisations')
           .delete(orgApi.delete_all_organisations); // OK --> delete all organisations

        app.route('/devicestypes')
         .delete(typeApi.delete_all_devicestypes); // OK --> delete all devices types

        app.route('/users')
            .delete(userApi.delete_all_users) // OK --> delete all users

        app.route('/usersgroups')
            .delete(userGroupApi.delete_all_usergroups); //ok --> deleting all users groups
    }

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
    app.route('/devicesgroups')
        .get(groupApi.list_group) // OK --> list of groups
        .post(groupApi.create_group); //OK --> create a group -- group id must be unique


    app.route('/devicesgroups/id/:appId')
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

    app.route('/devicestypes/name/:Name')
        .delete(typeApi.delete_devicestypes) //OK --> delete a specified device types
        .get(typeApi.information_devicestypes) //OK --> get information about a specified device type
        .put(typeApi.update_devicestypes); // OK --> update information about a device type

    app.route('/devicestypes/id/:id')
        .delete(typeApi.delete_devicestypesid) // OK --> delete a devicestypes by ID
        .get(typeApi.information_devicestypesid) //OK --> get information of devicestypes by ID
        .put(typeApi.update_devicestypesid); //OK --> update information about a device type by ID

    /*
    *-----------------------
    * USER ROUTER
    * ----------------------
     */

    app.route('/users')
        .get(userApi.list_users) // OK --> list of all users
        .post(userApi.create_user); // OK --> create a user

    app.route('/users/id/:UserId')
        .get(userApi.user_info) //OK --> get information of user
        .delete(userApi.delete_user) //OK --> delete a user
        .put(userApi.update_user); //OK --> update a user

    /*
    *----------------------
    * USER GROUP ROUTER
    * ---------------------
     */

    app.route('/usersgroups')
        .get(userGroupApi.list_groups) // OK
        .post(userGroupApi.create_group); // OK

    app.route('/usersgroups/id/:Gid')
        .get(userGroupApi.get_info) // OK
        .delete(userGroupApi.delete_group) // OK
        .put(userGroupApi.update_group);

    app.route('/usersgroups/user/:Uid')
        .get(userGroupApi.get_infoU);


    /*
    *------------------------
    * LOCALISATION ROUTER
    * -----------------------
     */

    app.route('/localisation/crypted')
        .post(LocalisationApi.crypted);

    app.route('/localisation/uncrypted')
        .post(LocalisationApi.uncrypted);


    /*
    *-----------------------
    * AUTH ROUTE
    * ----------------------
    */

    app.route('/auth/:user/:password')
        .get(jwt_auth.submit_auth);

};