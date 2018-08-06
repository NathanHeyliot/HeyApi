'use strict';

exports.route_config = function () {
    let route = [

        /*
         * PERMISSIONS ROUTER
         */

        {
            url: "/permissions",
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
            url: "/ranks",
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



        {
            url: "/callback",
            method: "POST",
            permission: "none",
            type: "FULL"
        }
    ];
    return route;
};