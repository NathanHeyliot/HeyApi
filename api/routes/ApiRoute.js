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
    app.use(Permissions.middlewarePermissions);

































    /*
    * ----------------------------------------
    * API ROUTE
    * ----------------------------------------
     */

    //app.route('/test')
      //  .post(payApi.test_payloads);

    app.route('/callback')
        .post(payApi.create_payload); //ROUTE FOR SIGFOX NO PERMISSION NEEDED      OK

    /*
    *-----------------------
    * AUTH ROUTE
    * ----------------------
    */

    app.route('/auth/:user/:password')
        .get(jwt_auth.submit_auth); //NO PERMISSION NEEDED      OK

    /*
    *---------------------
    * ROAD ROUTER
    * -------------------
     */

    app.route("/road")
        .post(LocalisationApi.road); //API_ROAD_POST     OK


    /*
    *--------------------------
    * RANKS ROUTER
    * -------------------------
     */

    app.route('/ranks')
        .get(Ranks.getRanks) //NO PERMISSION NEEDED     OK
        .post(Ranks.createRanks) //API_RANKS_POST     OK
        .delete(Ranks.delete_allRanks); //API_RANKS_DELALL    OK

    app.route('/ranks/id/:id')
        .get(Ranks.getRank) //NO PERMISSION NEEDED    OK
        .delete(Ranks.removeRanks) //API_RANKS_DEL     OK
        .put(Ranks.updateRanks); //API_RANKS_PUT      OK

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
        .get(payApi.list_payload) // API_PAYLOADS_GET   OK
        .delete(payApi.delete_all_payloads); // API_PAYLOADS_DELALL   OK

    app.route('/payloads/id/:appId')
        .get(payApi.read_payload) //API_PAYLOADS_GET    OK
        .delete(payApi.delete_payload); //API_PAYLOADS_DEL   OK

    app.route('/payloads/id/:appId/:type/:start/:end')
        .get(payApi.adv_read_payloads);

    app.route('/payloads/id/:appId/:type')
        .get(payApi.count_payloads);

    app.route('/payloads/adv/:type/:nbr')
        .get(payApi.advb_read_payloads);

    app.route('/payloads/adv')
        .post(payApi.get_last_com);

    app.route('/payloads/deviceId/:DeviceId')
        .get(payApi.get_paybydevice); //API_PAYLOADS_GET   OK

    /*
    *--------------------------
    * DEVICE ROUTER
    * -------------------------
     */
    app.route('/devices')
        .get(deviceApi.list_device) //API_DEVICES_GET    OK
        .post(deviceApi.create_device) //API_DEVICES_POST    OK
        .delete(deviceApi.delete_all_devices); //API_DEVICES_DELALL   OK

    app.route('/devices/id/:appId')
        .get(deviceApi.read_device)  //API_DEVICES_GET   OK
        .put(deviceApi.update_device) //API_DEVICES_PUT    OK
        .delete(deviceApi.delete_device); //API_DEVICES_DEL     OK

    app.route('/devices/group/:GroupId')
        .get(deviceApi.list_group_devices); //API_DEVICES_GET    OK

    app.route('/devices/user/:UID')
        .get(deviceApi.list_user_devices); //API_DEVICES_GET   OK

    app.route('/devices/type/:DeviceType')
        .get(deviceApi.list_bytype); //API_DEVICES_GET   OK


    /*
    *--------------------------
    * GROUPS ROUTER
    * -------------------------
     */
    app.route('/devicesgroups')
        .get(groupApi.list_group) //API_DEVICESGRP_GET    OK
        .post(groupApi.create_group) //API_DEVICESGRP_POST    OK
        .delete(groupApi.delete_all_groups); //API_DEVICESGRP_DELALL   OK


    app.route('/devicesgroups/id/:appId')
        .delete(groupApi.delete_group) //API_DEVICESGRP_DEL   OK
        .get(groupApi.read_group) //API_DEVICESGRP_GET   OK
        .put (groupApi.update_group); //API_DEVICESGRP_PUT    OK


    /*
    *--------------------------
    * ORGANISATIONS ROUTER
    * -------------------------
     */
    app.route('/organisations')
        .get(orgApi.list_organisation) //API_ORGANISATIONS_GET   OK
        .post(orgApi.create_organisation) //API_ORGANISATIONS_POST    OK
        .delete(orgApi.delete_all_organisations); //API_ORGANISATIONS_DELALL   OK

    app.route('/organisations/id/:appId')
        .put(orgApi.update_organisation) //API_ORGANISATIONS_PUT    OK
        .get(orgApi.get_organisation) //API_ORGANISATIONS_GET    OK
        .delete(orgApi.delete_organisation); //API_ORGANISATIONS_DEL   OK

    /*
    *--------------------------
    * DEVICES TYPES ROUTER
    * -------------------------
     */
    app.route('/devicestypes')
        .get(typeApi.list_devicetypes) //API_DEVICESTYPES_GET     OK
        .post(typeApi.create_devicetypes) //API_DEVICESTYPES_POST      OK
        .delete(typeApi.delete_all_devicestypes); //API_DEVICESTYPES_DELALL    OK

    app.route('/devicestypes/name/:Name')
        .delete(typeApi.delete_devicestypes) //API_DEVICESTYPES_DEL     OK
        .get(typeApi.information_devicestypes) //API_DEVICESTYPES_GET     OK
        .put(typeApi.update_devicestypes); //API_DEVICESTYPES_PUT      OK

    app.route('/devicestypes/id/:id')
        .delete(typeApi.delete_devicestypesid) //API_DEVICESTYPES_DEL     OK
        .get(typeApi.information_devicestypesid) //API_DEVICESTYPES_GET      OK
        .put(typeApi.update_devicestypesid); //API_DEVICESTYPES_PUT     OK

    /*
    *-----------------------
    * USER ROUTER
    * ----------------------
     */

    app.route('/users')
        .get(userApi.list_users) //API_USERS_GET       OK
        .post(userApi.create_user) //API_USERS_POST         OK
        .delete(userApi.delete_all_users); //API_USERS_DELALL       OK

    app.route('/users/id/:UserId')
        .get(userApi.user_info) //API_USERS_GET       OK
        .delete(userApi.delete_user) //API_USERS_DEL       OK
        .put(userApi.update_user); //API_USERS_PUT      OK

    /*
    *----------------------
    * USER GROUP ROUTER
    * ---------------------
     */

    app.route('/usersgroups')
        .get(userGroupApi.list_groups) //API_USERSGRP_GET      OK
        .post(userGroupApi.create_group) //API_USERSGRP_POST        OK
        .delete(userGroupApi.delete_all_usergroups); //API_USERSGRP_DELALL      OK

    app.route('/usersgroups/id/:Gid')
        .get(userGroupApi.get_info) //API_USERSGRP_GET      OK
        .delete(userGroupApi.delete_group) //API_USERSGRP_DEL        OK
        .put(userGroupApi.update_group); //API_USERSGRP_PUT       OK

    app.route('/usersgroups/user/:Uid')
        .get(userGroupApi.get_infoU) //API_USERSGRP_GET       OK
        .delete(userGroupApi.delete_infoU); //API_USERSGRP_DEL     OK

    app.route('/usersgroups/group/:Gid')
        .delete(userGroupApi.delete_infoG); //API_USERSGRP_GET     OK


    /*
    *------------------------
    * LOCALISATION ROUTER
    * -----------------------
     */

    app.route('/localisation/crypted')
        .post(LocalisationApi.crypted); //API_LOCALISATION_POST      OK

    app.route('/localisation/uncrypted')
        .post(LocalisationApi.uncrypted); //API_LOCALISATION_POST        OK
};