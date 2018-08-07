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
    * GLOBAL PERMISSION  --> These permissions overwrite others ones
    * -------------------------
     */

    API_BYPASS_GET:
        {
            type: Boolean, default: false
        },
    API_BYPASS_POST:
        {
            type: Boolean, default: false
        },
    API_BYPASS_PUT:
        {
            type: Boolean, default: false
        },
    API_BYPASS_DELETE:
        {
            type: Boolean, default: false
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
    API_PAYLOADS_DEL:
        {
            type: Boolean, default: false
        },
    API_PAYLOADS_DELALL:
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
    API_DEVICES_POST:
        {
            type: Boolean, default: false
        },
    API_DEVICES_DELALL:
        {
            type: Boolean, default: false
        },
    API_DEVICES_PUT:
        {
            type: Boolean, default: false
        },
    API_DEVICES_DEL:
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
    API_DEVICESGRP_POST:
        {
            type: Boolean, default: false
        },
    API_DEVICESGRP_DELALL:
        {
            type: Boolean, default: false
        },
    API_DEVICESGRP_DEL:
        {
            type: Boolean, default: false
        },
    API_DEVICESGRP_PUT:
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
    API_ORGANISATIONS_POST:
        {
            type: Boolean, default: false
        },
    API_ORGANISATIONS_DELALL:
        {
            type: Boolean, default: false
        },
    API_ORGANISATIONS_PUT:
        {
            type: Boolean, default: false
        },
    API_ORGANISATIONS_DEL:
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
    API_DEVICESTYPES_DELALL:
        {
            type: Boolean, default: false
        },
    API_DEVICESTYPES_POST:
        {
            type: Boolean, default: false
        },
    API_DEVICESTYPES_DEL:
        {
            type: Boolean, default: false
        },
    API_DEVICESTYPES_PUT:
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
    API_USERS_POST:
        {
            type: Boolean, default: false
        },
    API_USERS_DELALL:
        {
            type: Boolean, default: false
        },
    API_USERS_DEL:
        {
            type: Boolean, default: false
        },
    API_USERS_PUT:
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
    API_USERSGRP_POST:
        {
            type: Boolean, default: false
        },
    API_USERSGRP_DELALL:
        {
            type: Boolean, default: false
        },
    API_USERSGRP_DEL:
        {
            type: Boolean, default: false
        },
    API_USERSGRP_PUT:
        {
            type: Boolean, default: false
        },

    /*
    *------------------------
    * LOCALISATION ROUTER
    * -----------------------
     */

    API_LOCALISATION_POST:
        {
            type: Boolean, default: false
        },

    /*
    *------------------------
    * RANKS ROUTER
    * -----------------------
     */

    API_RANKS_POST:
        {
            type: Boolean, default: false
        },
    API_RANKS_DEL:
        {
            type: Boolean, default: false
        },
    API_RANKS_DELALL:
        {
            type: Boolean, default: false
        },
    API_RANKS_GETID:
        {
            type: Boolean, default: false
        },
    API_RANKS_DELID:
        {
            type: Boolean, default: false
        },
    API_RANKS_PUTID:
        {
            type: Boolean, default: false
        },
    /*
    *------------------------
    * PERMISSIONS ROUTER
    * -----------------------
     */

    API_PERMISSIONS_POST:
        {
            type: Boolean, default: false
        },
    API_PERMISSIONS_DEL:
        {
            type: Boolean, default: false
        },
    API_PERMISSIONS_GETID:
        {
            type: Boolean, default: false
        },
    API_PERMISSIONS_DELID:
        {
            type: Boolean, default: false
        },
    API_PERMISSIONS_PUTID:
        {
            type: Boolean, default: false
        },

    /*
    *------------------------
    * ROAD ROUTER
    * -----------------------
     */

    API_ROAD_POST:
        {
          type: Boolean, default: false
        },


    //-------------------------------------------------------------------------
    // PANEL PERMISSIONS !!!!! /!\
    //-------------------------------------------------------------------------

    PANEL_SHOW_ADVANCED:
        {
          type Boolean, default: false
        },
});

module.exports =  mongoose.model('Permissions', PermissionsModel);