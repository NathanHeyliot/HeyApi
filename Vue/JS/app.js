new Vue({
    el: '#app',
    data: {
        nbPres: 150,
        Success: false,
    },
    methods: {
        dl_done: function () {
            this.Success = true;
        },
        v_close: function () {
            this.Success = false;
        }
    }
});
