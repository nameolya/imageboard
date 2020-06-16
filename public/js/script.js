(function () {
    console.log("sanity check");

    new Vue({
        el: "#main",
        data: {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
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

        methods: {
            handleClick: function (e) {
                console.log("clicked submit  button!");
                // prevent refresh from running on button click:
                e.preventDefault();
                // whatever code I write will run whenever the user clicks the submit btn
                // to see what is in my data object of the vue instance log this
                console.log("this:", this);
                // we NEED to use FormData to send a file to the server
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);
                // formData has this strange behavior that if I console.log it at this point it will log an empty object!!! You have to loop through the values of the object in a specific way if you want to see them client side.
                var thisOfData = this;
                axios
                    .post("/upload", formData)
                    .then(function (resp) {
                        console.log("resp from POST /upload:", resp);
                        console.log("res.data:", resp.data);
                        thisOfData.images.unshift(resp.data);
                        thisOfData.title = thisOfData.description = thisOfData.username =
                            "";
                        thisOfData.file = null;
                    })
                    .catch(function (err) {
                        console.log("err in POST /upload:", err);
                    });
            },
            handleChange: function (e) {
                console.log("handleChange ran");
                // our eventobject has access to the file that was put the input field, aka selected for upload
                console.log("file:", e.target.files[0]);
                // make sure that our file property of our data object holds the value of our file in the input field
                this.file = e.target.files[0];
                // we are using FormData because we want to send files along in our request to the server!
            },
        },
    });
})();
