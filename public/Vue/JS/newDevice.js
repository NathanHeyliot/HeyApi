new Vue({
    el: '#newDevice',
    data: {
        save: false,
        cancel: false,
        devnb: 33,
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
