'use strict';

exports.route_config = function () {
    let route = [

        /*
         * PERMISSIONS ROUTER
         */

        {
            url: "/permissions", //bypass tag is not checked here !
            method: "GET",
            permission: "none",
            type: "FULL",
        },
        {
            url: "/permissions",
            method: "POST",
            permission: "API_PERMISSIONS_POST",
            type: "FULL",
        },
        {
            url: "/permissions",
            method: "DELETE",
            permission: "API_PERMISSIONS_DEL",
            type: "FULL",
        },
        {
            url: "/permissions/id/",
            method: "GET",
            permission: "none",
            type: "PARTIAL"
        },
        {
            url: "/permissions/id/",
            method: "DELETE",
            permission: "API_PERMISSIONS_DEL",
            type: "PARTIAL"
        },
        {
            url: "/permissions/id/",
            method: "PUT",
            permission: "API_PERMISSIONS_PUT",
            type: "PARTIAL"
        },

        /*
         * RANKS ROUTER
         */

        {
            url: "/ranks",  //bypass tag is not checked here !
            method: "GET",
            permission: "none",
            type: "FULL",
        },
        {
            url: "/ranks",
            method: "POST",
            permission: "API_RANKS_POST",
            type: "FULL",
        },
        {
            url: "/ranks",
            method: "DELETE",
            permission: "API_RANKS_DELALL",
            type: "FULL",
        },
        {
            url: "/ranks/id/",
            method: "GET",
            permission: "none",
            type: "PARTIAL",
        },
        {
            url: "/ranks/id/",
            method: "DELETE",
            permission: "API_RANKS_DEL",
            type: "PARTIAL",
        },
        {
            url: "/ranks/id/",
            method: "PUT",
            permission: "API_RANKS_PUT",
            type: "PARTIAL",
        },

        /*
        *----------------------
        * USER GROUP ROUTER
        * ---------------------
         */

        {
            url: "/usersgroups",
            method: "GET",
            permission: "none",
            type: "FULL",
        },
        {
            url: "/usersgroups",
            method: "POST",
            permission: "API_USERSGRP_POST",
            type: "FULL",
        },
        {
            url: "/usersgroups",
            method: "DELETE",
            permission: "API_USERSGRP_DELALL",
            type: "FULL",
        },
        {
            url: "/usersgroups/id/",
            method: "GET",
            permission: "none",
            type: "PARTIAL",
        },
        {
            url: "/usersgroups/id/",
            method: "PUT",
            permission: "API_USERSGRP_PUT",
            type: "PARTIAL",
        },
        {
            url: "/usersgroups/id/",
            method: "DELETE",
            permission: "API_USERSGRP_DEL",
            type: "PARTIAL",
        },
        {
            url: "/usersgroups/user/",
            method: "GET",
            permission: "none",
            type: "PARTIAL",
        },
        {
            url: "/usersgroups/user/",
            method: "DELETE",
            permission: "API_USERSGRP_DEL",
            type: "PARTIAL",
        },
        {
            url: "/usersgroups/group/",
            method: "DELETE",
            permission: "API_USERSGRP_GET",
            type: "PARTIAL",
        },

        /*
         * USER ROUTER
         */

        {
            url: "/users",
            method: "GET",
            permission: "none",
            type: "FULL",
        },
        {
            url: "/users",
            method: "POST",
            permission: "API_USERS_POST",
            type: "FULL",
        },
        {
            url: "/users",
            method: "DELETE",
            permission: "API_USERS_DELALL",
            type: "FULL",
        },
        {
            url: "/users/id/",
            method: "GET",
            permission: "none",
            type: "PARTIAL",
        },
        {
            url: "/users/id/",
            method: "DELETE",
            permission: "API_USERS_DEL",
            type: "PARTIAL",
        },
        {
            url: "/users/id/",
            method: "PUT",
            permission: "API_USERS_PUT",
            type: "PARTIAL",
        },

        /*
         * DEVICES TYPES ROUTER
         */

        {
            url: "/devicestypes",
            method: "GET",
            permission: "none",
            type: "FULL",
        },
        {
            url: "/devicestypes",
            method: "POST",
            permission: "API_DEVICESTYPES_POST",
            type: "FULL",
        },
        {
            url: "/devicestypes",
            method: "DELETE",
            permission: "API_DEVICESTYPES_DELALL",
            type: "FULL",
        },
        {
            url: "/devicestypes/name/",
            method: "GET",
            permission: "none",
            type: "PARTIAL",
        },
        {
            url: "/devicestypes/name/",
            method: "DELETE",
            permission: "API_DEVICESTYPES_DEL",
            type: "PARTIAL",
        },
        {
            url: "/devicestypes/name/",
            method: "PUT",
            permission: "API_DEVICESTYPES_PUT",
            type: "PARTIAL",
        },
        {
            url: "/devicestypes/id/",
            method: "GET",
            permission: "none",
            type: "PARTIAL",
        },
        {
            url: "/devicestypes/id/",
            method: "DELETE",
            permission: "API_DEVICESTYPES_DEL",
            type: "PARTIAL",
        },
        {
            url: "/devicestypes/id/",
            method: "PUT",
            permission: "API_DEVICESTYPES_PUT",
            type: "PARTIAL",
        },


        /*
         * ORGANISATIONS ROUTER
         */

        {
            url: "/organisations",
            method: "GET",
            permission: "none",
            type: "FULL",
        },
        {
            url: "/organisations",
            method: "POST",
            permission: "API_ORGANISATIONS_POST",
            type: "FULL",
        },
        {
            url: "/organisations",
            method: "DELETE",
            permission: "API_ORGANISATIONS_DELALL",
            type: "FULL",
        },
        {
            url: "/organisations/id/",
            method: "GET",
            permission: "none",
            type: "PARTIAL",
        },
        {
            url: "/organisations/id/",
            method: "DELETE",
            permission: "API_ORGANISATIONS_DEL",
            type: "PARTIAL",
        },
        {
            url: "/organisations/id/",
            method: "PUT",
            permission: "API_ORGANISATIONS_PUT",
            type: "PARTIAL",
        },

        /*
         * GROUPS ROUTER
         */

        {
            url: "/devicesgroups",
            method: "GET",
            permission: "none",
            type: "FULL",
        },
        {
            url: "/devicesgroups",
            method: "POST",
            permission: "API_DEVICESGRP_POST",
            type: "FULL",
        },
        {
            url: "/devicesgroups",
            method: "DELETE",
            permission: "API_DEVICESGRP_DELALL",
            type: "FULL",
        },
        {
            url: "/devicesgroups/id/",
            method: "GET",
            permission: "none",
            type: "PARTIAL",
        },
        {
            url: "/devicesgroups/id/",
            method: "DELETE",
            permission: "API_DEVICESGRP_DEL",
            type: "PARTIAL",
        },
        {
            url: "/devicesgroups/id/",
            method: "PUT",
            permission: "API_DEVICESGRP_PUT",
            type: "PARTIAL",
        },

        /*
         * DEVICE ROUTER
         */

        {
            url: "/devices",
            method: "GET",
            permission: "none",
            type: "FULL",
        },
        {
            url: "/devices",
            method: "POST",
            permission: "API_DEVICES_POST",
            type: "FULL",
        },
        {
            url: "/devices",
            method: "DELETE",
            permission: "API_DEVICES_DELALL",
            type: "FULL",
        },
        {
            url: "/devices/id/",
            method: "GET",
            permission: "none",
            type: "PARTIAL",
        },
        {
            url: "/devices/id/",
            method: "DELETE",
            permission: "API_DEVICES_DEL",
            type: "PARTIAL",
        },
        {
            url: "/devices/id/",
            method: "PUT",
            permission: "API_DEVICES_PUT",
            type: "PARTIAL",
        },
        {
            url: "/devices/group/",
            method: "GET",
            permission: "none",
            type: "PARTIAL",
        },
        {
            url: "/devices/user/",
            method: "GET",
            permission: "none",
            type: "PARTIAL",
        },
        {
            url: "/devices/type/",
            method: "GET",
            permission: "none",
            type: "PARTIAL",
        },

        /*
         * PAYLOADS ROUTER
         */

        {
            url: "/payloads",
            method: "GET",
            permission: "API_PAYLOADS_GET",
            type: "FULL",
        },
        {
            url: "/payloads",
            method: "DELETE",
            permission: "API_PAYLOADS_DELALL",
            type: "FULL",
        },
        {
            url: "/payloads/id/",
            method: "DELETE",
            permission: "API_PAYLOADS_DEL",
            type: "FULL",
        },
        {
            url: "/payloads/id/",
            method: "GET",
            permission: "API_PAYLOADS_GET",
            type: "PARTIAL",
        },
        {
            url: "/payloads/deviceId/",
            method: "GET",
            permission: "API_PAYLOADS_GET",
            type: "PARTIAL",
        },
        {
            url: "/payloads/adv/",
            method: "GET",
            permission: "API_PAYLOADS_GET",
            type: "PARTIAL",
        },
        {
            url: "/payloads/adv",
            method: "POST",
            permission: "API_PAYLOADS_GET",
            type: "FULL",
        },

        /*
         * ROAD ROUTER
         */
        {
            url: "/road",
            method: "POST",
            permission: "API_ROAD_POST",
            type: "FULL",
        },

        /*
         * LOCALISATION ROUTER
         */
        {
            url: "/localisation/crypted",
            method: "POST",
            permission: "API_LOCALISATION_POST",
            type: "FULL",
        },
        {
            url: "/localisation/uncrypted",
            method: "POST",
            permission: "API_LOCALISATION_POST",
            type: "FULL",
        },

        /*
         * Auth
         */

        {
            url: "/auth",
            method: "GET",
            permission: "none",
            type: "PARTIAL"
        },

        /*
         * Callback
         */

        {
            url: "/callback",
            method: "POST",
            permission: "none",
            type: "FULL"
        }
    ];
    return route;
};