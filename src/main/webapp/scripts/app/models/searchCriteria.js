define(['backbone'], function (Backbone) {
    'use strict';
    console.log('[Model]SearchCriteria::loading...');
    var SearchCriteria = Backbone.Model.extend({
        constructor: function () {
            _.bindAll(this, 'changeCustomerMode', 'changeMeetingAreaMode', 'changeDoctorMode');
            this.defaults = _.extend({}, {
                text: "",
                customerMode: false,
                meetingAreaMode: true,
                doctorMode: false
                }, this.defaults);
            Backbone.Model.prototype.constructor.apply(this, arguments);
        },
        changeCustomerMode: function () {
            this.set("customerMode", !this.get("customerMode"));
        },
        changeMeetingAreaMode: function () {
            this.set("meetingAreaMode", !this.get("meetingAreaMode"));
        },
        changeDoctorMode: function () {
            this.set("doctorMode", !this.get("doctorMode"));
        },
    });
    return SearchCriteria;
});
