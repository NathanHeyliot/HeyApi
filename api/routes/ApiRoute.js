'use strict'

module.exports = function (app) {
    let payApi = require("../controllers/ApiController");
    let deviceApi = require("../controllers/DeviceController");
    let groupApi = require("../controllers/GroupController");
    let orgApi = require("../controllers/OrganisationController");
    let typeApi = require("../controllers/TypesController");

    app.route('/payloads')
        .get(payApi.list_payload)
        .post(payApi.create_payload);

    app.route('/payloads/id/:appId')
        .get(payApi.read_payload)
        .put(payApi.update_payload) // temporaire voué a disparaitre!
        .delete(payApi.delete_payload);

    app.route('/payloads/deviceId/:DeviceId')
        .get(payApi.get_paybydevice);


    app.route('/devices')
        .get(deviceApi.list_device)
        .post(deviceApi.create_device);

    app.route('/devices/id/:appId')
        .get(deviceApi.read_device)
        .delete(deviceApi.delete_device);

    app.route('/devices/group/:GroupId')
        .get(deviceApi.list_group_devices);

    app.route('/devices/type/:DeviceType')
        .get(deviceApi.list_bytype)


    app.route('/groups')
        .get(groupApi.list_group)
        .post(groupApi.create_group);

    app.route('/groups/id/:appId')
        .put (groupApi.update_group)
        .delete(groupApi.delete_group);

    app.route('/organisations')
        .get(orgApi.list_organisation)
        .post(orgApi.crate_organisation);

    app.route('/organisations/id/:appId')
        .put(orgApi.update_organisation)
        .delete(orgApi.delete_organisation);

    app.route('/devicestypes')
        .get(typeApi.list_devicetypes)
        .post(typeApi.create_devicetypes);

    app.route('/devicestypes/name/:Name')
        .delete(typeApi.delete_devicestypes);
};