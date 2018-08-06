'use strict';

module.exports = function (app) {
    let payApi = require("../controllers/PayloadsController");
    let deviceApi = require("../controllers/DeviceController");
    let groupApi = require("../controllers/GroupController");
    let orgApi = require("../controllers/OrganisationController");
    let typeApi = require("../controllers/TypesController");
    let jwt_auth = require("../controllers/AuthController");
    let userApi = require("../controllers/UserController");
    let userGroupApi = require("../controllers/UserGroupController");
    let LocalisationApi = require("../controllers/LocalisationController");
    let Ranks = require("../controllers/RanksController");
    let Permissions = require('../controllers/PermissionsController');

    var cors = require('cors');

    app.use(cors());

    /*
    * MIDDLEWARE AUTH
     */

    app.use(jwt_auth.middle_token);

    /*
    * ----------------------------------------
    * API ROUTE
    * ----------------------------------------
     */

    app.route('/callback')
        .post(payApi.create_payload); //ROUTE FOR SIGFOX NO PERMISSION NEEDED

    /*
    *-----------------------
    * AUTH ROUTE
    * ----------------------
    */

    app.route('/auth/:user/:password')
        .get(jwt_auth.submit_auth); //NO PERMISSION NEEDED

    /*
    *---------------------
    * ROAD ROUTER
    * -------------------
     */

    app.route("/road")
        .post(LocalisationApi.road); //API_PAYLOADS_ROADPOST --> OK


    /*
    *--------------------------
    * RANKS ROUTER
    * -------------------------
     */

    app.route('/ranks')
        .get(Ranks.getRanks) //NO PERMISSION NEEDED --> OK
        .post(Ranks.createRanks) //API_RANKS_POST --> OK
        .delete(Ranks.delete_allRanks); //API_RANKS_DELALL --> OK

    app.route('/ranks/id/:id')
        .get(Ranks.getRank) //NO PERMISSION NEEDED --> OK
        .delete(Ranks.removeRanks) //API_RANKS_DEL --> OK
        .put(Ranks.updateRanks); //API_RANKS_PUT --> OK

    /*
    *--------------------------
    * PERMISSIONS ROUTER
    * -------------------------
     */

    app.route('/permissions')
        .get(Permissions.getPermissions) //NO PERMISSION NEEDED --> OK
        .post(Permissions.createPermissions) // API_PERMISSIONS_POST --> OK
        .delete(Permissions.delete_allPermissions); // API_PERMISSIONS_DEL --> OK

    app.route('/permissions/id/:id')
        .get(Permissions.getPermission) //NO PERMISSION NEEDED --> OK
        .delete(Permissions.removePermissions) // API_PERMISSIONS_DEL --> OK
        .put(Permissions.updatePermissions); // API_PERMISSIONS_PUT --> OK


    /*
    *--------------------------
    * PAYLOAD ROUTER
    * -------------------------
     */

    app.route('/payloads')
        .get(payApi.list_payload) // API_PAYLOADS_GET
        .delete(payApi.delete_all_payloads); // API_PAYLOADS_DELALL

    app.route('/payloads/id/:appId')
        .get(payApi.read_payload) //API_PAYLOADS_GET
        .delete(payApi.delete_payload); //API_PAYLOADS_DEL

    app.route('/payloads/deviceId/:DeviceId')
        .get(payApi.get_paybydevice); //API_PAYLOADS_GET

    /*
    *--------------------------
    * DEVICE ROUTER
    * -------------------------
     */
    app.route('/devices')
        .get(deviceApi.list_device) //API_DEVICES_GET
        .post(deviceApi.create_device) //API_DEVICES_POST
        .delete(deviceApi.delete_all_devices); //API_DEVICES_DELALL

    app.route('/devices/id/:appId')
        .get(deviceApi.read_device)  //API_DEVICES_GET
        .put(deviceApi.update_device) //API_DEVICES_PUT
        .delete(deviceApi.delete_device); //API_DEVICES_DEL

    app.route('/devices/group/:GroupId')
        .get(deviceApi.list_group_devices); //API_DEVICES_GET

    app.route('/devices/user/:UID')
        .get(deviceApi.list_user_devices); //API_DEVICES_GET

    app.route('/devices/type/:DeviceType')
        .get(deviceApi.list_bytype); //API_DEVICES_GET


    /*
    *--------------------------
    * GROUPS ROUTER
    * -------------------------
     */
    app.route('/devicesgroups')
        .get(groupApi.list_group) //API_DEVICESGRP_GET
        .post(groupApi.create_group) //API_DEVICESGRP_POST
        .delete(groupApi.delete_all_groups); //API_DEVICESGRP_DELALL


    app.route('/devicesgroups/id/:appId')
        .delete(groupApi.delete_group) //API_DEVICESGRP_DEL
        .get(groupApi.read_group) //API_DEVICESGRP_GET
        .put (groupApi.update_group); //API_DEVICESGRP_PUT


    /*
    *--------------------------
    * ORGANISATIONS ROUTER
    * -------------------------
     */
    app.route('/organisations')
        .get(orgApi.list_organisation) //API_ORGANISATIONS_GET
        .post(orgApi.create_organisation) //API_ORGANISATIONS_POST
        .delete(orgApi.delete_all_organisations); //API_ORGANISATIONS_DELALL

    app.route('/organisations/id/:appId')
        .put(orgApi.update_organisation) //API_ORGANISATIONS_PUT
        .get(orgApi.get_organisation) //API_ORGANISATIONS_GET
        .delete(orgApi.delete_organisation); //API_ORGANISATIONS_DEL

    /*
    *--------------------------
    * DEVICES TYPES ROUTER
    * -------------------------
     */
    app.route('/devicestypes')
        .get(typeApi.list_devicetypes) //API_DEVICESTYPES_GET
        .post(typeApi.create_devicetypes) //API_DEVICESTYPES_POST
        .delete(typeApi.delete_all_devicestypes); //API_DEVICESTYPES_DELALL

    app.route('/devicestypes/name/:Name')
        .delete(typeApi.delete_devicestypes) //API_DEVICESTYPES_DEL
        .get(typeApi.information_devicestypes) //API_DEVICESTYPES_GET
        .put(typeApi.update_devicestypes); //API_DEVICESTYPES_PUT

    app.route('/devicestypes/id/:id')
        .delete(typeApi.delete_devicestypesid) //API_DEVICESTYPES_DEL
        .get(typeApi.information_devicestypesid) //API_DEVICESTYPES_GET
        .put(typeApi.update_devicestypesid); //API_DEVICESTYPES_PUT

    /*
    *-----------------------
    * USER ROUTER
    * ----------------------
     */

    app.route('/users')
        .get(userApi.list_users) //API_USERS_GET
        .post(userApi.create_user) //API_USERS_POST
        .delete(userApi.delete_all_users); //API_USERS_DELALL

    app.route('/users/id/:UserId')
        .get(userApi.user_info) //API_USERS_GET
        .delete(userApi.delete_user) //API_USERS_DEL
        .put(userApi.update_user); //API_USERS_PUT

    /*
    *----------------------
    * USER GROUP ROUTER
    * ---------------------
     */

    app.route('/usersgroups')
        .get(userGroupApi.list_groups) //API_USERSGRP_GET
        .post(userGroupApi.create_group) //API_USERSGRP_POST
        .delete(userGroupApi.delete_all_usergroups); //API_USERSGRP_DELALL

    app.route('/usersgroups/id/:Gid')
        .get(userGroupApi.get_info) //API_USERSGRP_GET
        .delete(userGroupApi.delete_group) //API_USERSGRP_DEL
        .put(userGroupApi.update_group); //API_USERSGRP_PUT

    app.route('/usersgroups/user/:Uid')
        .get(userGroupApi.get_infoU) //API_USERSGRP_GET
        .delete(userGroupApi.delete_infoU); //API_USERSGRP_DEL

    app.route('/usersgroups/group/:Gid')
        .delete(userGroupApi.delete_infoG); //API_USERSGRP_GET


    /*
    *------------------------
    * LOCALISATION ROUTER
    * -----------------------
     */

    app.route('/localisation/crypted')
        .post(LocalisationApi.crypted); //API_LOCALISATION_POSTCRYPTED  --> OK

    app.route('/localisation/uncrypted')
        .post(LocalisationApi.uncrypted); //API_LOCALISATION_POSTUNCRYPTED --> OK
};