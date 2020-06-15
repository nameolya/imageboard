console.log("sanity check");

new Vue({
    el: "#main",
    data: {
        images: [],
    },
    mounted: function () {
        var self = this;
        axios
            .get("/images")
            .then(function (response) {
                console.log("response.data: ", response.data);
                self.images = response.data;
            })
            .catch((err) => {
                console.log("err: ", err);
            });
    },
});
