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
        .post(LocalisationApi.road); //API_PAYLOADS_ROADPOST


    /*
    *--------------------------
    * RANKS ROUTER
    * -------------------------
     */

    app.route('/ranks')
        .get(Ranks.getRanks) //NO PERMISSION NEEDED -- API_RANKS_GET_BYPASS ------>>>>>>> OK
        .post(Ranks.createRanks) //API_RANKS_POST
        .delete(Ranks.delete_allRanks); //API_RANKS_DEL

    app.route('/ranks/id/:id')
        .get(Ranks.getRank) //API_RANKS_GETID -
        .delete(Ranks.removeRanks) //API_RANKS_DELID
        .put(Ranks.updateRanks); //API_RANKS_PUTID

    /*
    *--------------------------
    * PERMISSIONS ROUTER
    * -------------------------
     */

    app.route('/permissions')
        .get(Permissions.getPermissions) //NO PERMISSION NEEDED -- API_PERMISSIONS_GET_BYPASS ------>>>>>>> OK
        .post(Permissions.createPermissions) // API_PERMISSIONS_POST
        .delete(Permissions.delete_allPermissions); // API_PERMISSIONS_DEL

    app.route('/permissions/id/:id')
        .get(Permissions.getPermission) //API_PERMISSIONS_GETID -
        .delete(Permissions.removePermissions) // API_PERMISSIONS_DELID
        .put(Permissions.updatePermissions); // API_PERMISSIONS_PUTID


    /*
    *--------------------------
    * PAYLOAD ROUTER
    * -------------------------
     */

    app.route('/payloads')
        .get(payApi.list_payload) // API_PAYLOADS_GET - API_PAYLOADS_GET_BYPASS
        .delete(payApi.delete_all_payloads); // API_PAYLOADS_DELALL

    app.route('/payloads/id/:appId')
        .get(payApi.read_payload) //API_PAYLOADS_GETID -
        .delete(payApi.delete_payload); //API_PAYLOADS_DELETEID

    app.route('/payloads/deviceId/:DeviceId')
        .get(payApi.get_paybydevice); //API_PAYLOADS_GETDEVICE -

    /*
    *--------------------------
    * DEVICE ROUTER
    * -------------------------
     */
    app.route('/devices')
        .get(deviceApi.list_device) //API_DEVICES_GET - API_DEVICES_GET_BYPASS
        .post(deviceApi.create_device) //API_DEVICES_POST
        .delete(deviceApi.delete_all_devices); //API_DEVICES_DELALL

    app.route('/devices/id/:appId')
        .get(deviceApi.read_device)  //API_DEVICES_GETID
        .put(deviceApi.update_device) //API_DEVICES_PUTID
        .delete(deviceApi.delete_device); //API_DEVICES_DELETEID

    app.route('/devices/group/:GroupId')
        .get(deviceApi.list_group_devices); //API_DEVICES_GETGRP -

    app.route('/devices/user/:UID')
        .get(deviceApi.list_user_devices); //API_DEVICES_GETUSR -

    app.route('/devices/type/:DeviceType')
        .get(deviceApi.list_bytype); //API_DEVICES_GETTYPE -


    /*
    *--------------------------
    * GROUPS ROUTER
    * -------------------------
     */
    app.route('/devicesgroups')
        .get(groupApi.list_group) //API_DEVICESGRP_GET - API_DEVICESGRP_GET_BYPASS
        .post(groupApi.create_group) //API_DEVICESGRP_POST
        .delete(groupApi.delete_all_groups); //API_DEVICESGRP_DELALL


    app.route('/devicesgroups/id/:appId')
        .delete(groupApi.delete_group) //API_DEVICESGRP_DELID
        .get(groupApi.read_group) //API_DEVICESGRP_GETID -
        .put (groupApi.update_group); //API_DEVICESGRP_PUTID


    /*
    *--------------------------
    * ORGANISATIONS ROUTER
    * -------------------------
     */
    app.route('/organisations')
        .get(orgApi.list_organisation) //API_ORGANISATIONS_GET - API_ORGANISATIONS_GET_BYPASS
        .post(orgApi.create_organisation) //API_ORGANISATIONS_POST
        .delete(orgApi.delete_all_organisations); //API_ORGANISATIONS_DELALL

    app.route('/organisations/id/:appId')
        .put(orgApi.update_organisation) //API_ORGANISATIONS_PUTID
        .get(orgApi.get_organisation) //API_ORGANISATIONS_GETID -
        .delete(orgApi.delete_organisation); //API_ORGANISATIONS_DELID

    /*
    *--------------------------
    * DEVICES TYPES ROUTER
    * -------------------------
     */
    app.route('/devicestypes')
        .get(typeApi.list_devicetypes) //API_DEVICESTYPES_GET - API_DEVICESTYPES_GET_BYPASS
        .post(typeApi.create_devicetypes) //API_DEVICESTYPES_POST
        .delete(typeApi.delete_all_devicestypes); //API_DEVICESTYPES_DELALL

    app.route('/devicestypes/name/:Name')
        .delete(typeApi.delete_devicestypes) //API_DEVICESTYPES_DELNAME
        .get(typeApi.information_devicestypes) //API_DEVICESTYPES_GETNAME -
        .put(typeApi.update_devicestypes); //API_DEVICESTYPES_PUTNAME

    app.route('/devicestypes/id/:id')
        .delete(typeApi.delete_devicestypesid) //API_DEVICESTYPES_DELID
        .get(typeApi.information_devicestypesid) //API_DEVICESTYPES_GETID -
        .put(typeApi.update_devicestypesid); //API_DEVICESTYPES_PUTID

    /*
    *-----------------------
    * USER ROUTER
    * ----------------------
     */

    app.route('/users')
        .get(userApi.list_users) //API_USERS_GET - API_USERS_GET_BYPASS
        .post(userApi.create_user) //API_USERS_POST
        .delete(userApi.delete_all_users); //API_USERS_DELALL

    app.route('/users/id/:UserId')
        .get(userApi.user_info) //API_USERS_GETID -
        .delete(userApi.delete_user) //API_USERS_DELID
        .put(userApi.update_user); //API_USERS_PUTID

    /*
    *----------------------
    * USER GROUP ROUTER
    * ---------------------
     */

    app.route('/usersgroups')
        .get(userGroupApi.list_groups) //API_USERSGRP_GET - API_USERSGRP_GET_BYPASS ------>>>>>>> OK
        .post(userGroupApi.create_group) //API_USERSGRP_POST
        .delete(userGroupApi.delete_all_usergroups); //API_USERSGRP_DELALL

    app.route('/usersgroups/id/:Gid')
        .get(userGroupApi.get_info) //API_USERSGRP_GETID -
        .delete(userGroupApi.delete_group) //API_USERSGRP_DELID
        .put(userGroupApi.update_group); //API_USERSGRP_PUTID

    app.route('/usersgroups/user/:Uid')
        .get(userGroupApi.get_infoU) //API_USERSGRP_GETUSR -
        .delete(userGroupApi.delete_infoU); //API_USERSGRP_DELUSER

    app.route('/usersgroups/group/:Gid')
        .delete(userGroupApi.delete_infoG); //API_USERSGRP_GETGRP


    /*
    *------------------------
    * LOCALISATION ROUTER
    * -----------------------
     */

    app.route('/localisation/crypted')
        .post(LocalisationApi.crypted("test")); //API_LOCALISATION_POSTCRYPTED  --> OK

    app.route('/localisation/uncrypted')
        .post(LocalisationApi.uncrypted); //API_LOCALISATION_POSTUNCRYPTED --> OK
};