new Vue({
    el: '#newDevice',
    data: {
        cancel: false,
    },
    methods: {
        openCancel: function () {
            this.cancel = true;
        },
        closeCancel: function () {
            this.cancel = false;
        }
    }
});
