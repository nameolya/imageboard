(function () {
    console.log("sanity check");

    Vue.component("image-component", {
        template: "#template",
        props: ["postTitle", "id"],
        data: function () {
            return {
                comments: [],
                title: "",
                description: "",
                username: "",
                url: "",
                created_at: null,
                id: null,
            };
        },
        mounted: function () {
            console.log("component mounted! this.postTitle:", this.postTitle);
            console.log("this.id: ", this.id);
            var self = this;
            axios
                .get("/image/" + self.id)
                //update the index.js file with this route, check data
                .then(function (response) {
                    console.log("response.data: ", response.data);
                    self.image = response.data;
                })
                .catch((err) => {
                    console.log("err: ", err);
                });
        },
        methods: {
            handleClick: function (e) {
                console.log("clicked submit comments button!");
                e.preventDefault();
                console.log("this:", this);
                //// change here:
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);
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

            closeModal: function () {
                console.log("close modal");
                this.$emit("close", this.comments);
            },
        },
    });

    new Vue({
        el: "#main",
        data: {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            //change this:
            selectedImage: null,
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
                console.log("clicked submit file button!");
                e.preventDefault();
                console.log("this:", this);
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);
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
                console.log("file:", e.target.files[0]);
                this.file = e.target.files[0];
            },
            closeModal: function () {
                //change this:
                console.log("the event close was heard!");
                // console.log("count:", count);
            },
        },
    });
})();
