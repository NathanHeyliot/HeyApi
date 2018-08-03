'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let PermissionsModel = new Schema
({
    RankId:
        {
            type: String, required: true
        },

    /*
   *--------------------------
   * PAYLOAD ROUTER
   * -------------------------
    */

    API_PAYLOADS_GET:
        {
            type: Boolean, default: false
        },
    API_PAYLOADS_GET_BYPASS:
        {
            type: Boolean, default: false
        },
    API_PAYLOADS_GETID:
        {
            type: Boolean, default: false
        },
    API_PAYLOADS_DELETEID:
        {
            type: Boolean, default: false
        },
    API_PAYLOADS_GETDEVICE:
        {
            type: Boolean, default: false
        },
    API_PAYLOADS_DELALL:
        {
            type: Boolean, default: false
        },
    API_PAYLOADS_ROADPOST:
        {
          type: Boolean, default: false
        },

    /*
    *--------------------------
    * DEVICE ROUTER
    * -------------------------
     */

    API_DEVICES_GET:
        {
            type: Boolean, default: false
        },
    API_DEVICES_GET_BYPASS:
        {
            type: Boolean, default: false
        },
    API_DEVICES_POST:
        {
            type: Boolean, default: false
        },
    API_DEVICES_DELALL:
        {
            type: Boolean, default: false
        },
    API_DEVICES_GETID:
        {
            type: Boolean, default: false
        },
    API_DEVICES_PUTID:
        {
            type: Boolean, default: false
        },
    API_DEVICES_DELETEID:
        {
            type: Boolean, default: false
        },
    API_DEVICES_GETGRP:
        {
            type: Boolean, default: false
        },
    API_DEVICES_GETTYPE:
        {
            type: Boolean, default: false
        },
    API_DEVICES_GETUSR:
        {
            type: Boolean, default: false
        },

    /*
   *--------------------------
   * GROUPS ROUTER
   * -------------------------
    */

    API_DEVICESGRP_GET:
        {
            type: Boolean, default: false
        },
    API_DEVICESGRP_GET_BYPASS:
        {
            type: Boolean, default: false
        },
    API_DEVICESGRP_POST:
        {
            type: Boolean, default: false
        },
    API_DEVICESGRP_DELALL:
        {
            type: Boolean, default: false
        },
    API_DEVICESGRP_GETID:
        {
            type: Boolean, default: false
        },
    API_DEVICESGRP_DELID:
        {
            type: Boolean, default: false
        },
    API_DEVICESGRP_PUTID:
        {
            type: Boolean, default: false
        },

    /*
    *--------------------------
    * ORGANISATIONS ROUTER
    * -------------------------
     */

    API_ORGANISATIONS_GET:
        {
            type: Boolean, default: false
        },
    API_ORGANISATIONS_GET_BYPASS:
        {
            type: Boolean, default: false
        },
    API_ORGANISATIONS_POST:
        {
            type: Boolean, default: false
        },
    API_ORGANISATIONS_DELALL:
        {
            type: Boolean, default: false
        },
    API_ORGANISATIONS_GETID:
        {
            type: Boolean, default: false
        },
    API_ORGANISATIONS_PUTID:
        {
            type: Boolean, default: false
        },
    API_ORGANISATIONS_DELID:
        {
            type: Boolean, default: false
        },

    /*
   *--------------------------
   * DEVICES TYPES ROUTER
   * -------------------------
    */

    API_DEVICESTYPES_GET:
        {
            type: Boolean, default: false
        },
    API_DEVICESTYPES_GET_BYPASS:
        {
            type: Boolean, default: false
        },
    API_DEVICESTYPES_DELALL:
        {
            type: Boolean, default: false
        },
    API_DEVICESTYPES_POST:
        {
            type: Boolean, default: false
        },
    API_DEVICESTYPES_GETNAME:
        {
            type: Boolean, default: false
        },
    API_DEVICESTYPES_DELNAME:
        {
            type: Boolean, default: false
        },
    API_DEVICESTYPES_PUTNAME:
        {
            type: Boolean, default: false
        },
    API_DEVICESTYPES_DELID:
        {
            type: Boolean, default: false
        },
    API_DEVICESTYPES_GETID:
        {
            type: Boolean, default: false
        },
    API_DEVICESTYPES_PUTID:
        {
            type: Boolean, default: false
        },

    /*
   *-----------------------
   * USER ROUTER
   * ----------------------
    */

    API_USERS_GET:
        {
            type: Boolean, default: false
        },
    API_USERS_GET_BYPASS:
        {
            type: Boolean, default: false
        },
    API_USERS_POST:
        {
            type: Boolean, default: false
        },
    API_USERS_DELALL:
        {
            type: Boolean, default: false
        },
    API_USERS_GETID:
        {
            type: Boolean, default: false
        },
    API_USERS_DELID:
        {
            type: Boolean, default: false
        },
    API_USERS_PUTID:
        {
            type: Boolean, default: false
        },

    /*
    *----------------------
    * USER GROUP ROUTER
    * ---------------------
     */

    API_USERSGRP_GET:
        {
            type: Boolean, default: false
        },
    API_USERSGRP_GET_BYPASS:
        {
            type: Boolean, default: false
        },
    API_USERSGRP_POST:
        {
            type: Boolean, default: false
        },
    API_USERSGRP_DELALL:
        {
            type: Boolean, default: false
        },
    API_USERSGRP_GETID:
        {
            type: Boolean, default: false
        },
    API_USERSGRP_DELID:
        {
            type: Boolean, default: false
        },
    API_USERSGRP_PUTID:
        {
            type: Boolean, default: false
        },
    API_USERSGRP_GETUSR:
        {
            type: Boolean, default: false
        },
    API_USERSGRP_DELUSER:
        {
            type: Boolean, default: false
        },
    API_USERSGRP_GETGRP:
        {
            type: Boolean, default: false
        },

    /*
    *------------------------
    * LOCALISATION ROUTER
    * -----------------------
     */

    API_LOCALISATION_POSTCRYPTED:
        {
            type: Boolean, default: false
        },
    API_LOCALISATION_POSTUNCRYPTED:
        {
            type: Boolean, default: false
        },
});

module.exports =  mongoose.model('Permissions', PermissionsModel);