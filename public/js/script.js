(function () {
    console.log("sanity check");

    Vue.component("image-component", {
        template: "#template",
        props: ["id"],
        data: function () {
            return {
                title: "",
                description: "",
                username: "",
                url: "",
                created_at: null,
                id: null,
                comments: [],
            };
        },
        mounted: function () {
            console.log("component mounted! this.postTitle:", this.postTitle);
            console.log("this.id: ", this.id);
            var self = this;

            axios
                .all([
                    axios.get("/image/" + self.id),
                    axios.get("/comments/" + self.id),
                ])
                .then(
                    axios.spread((imageRes, commentsRes) => {
                        console.log("imageRes.data[0]: ", imageRes.data[0]);
                        console.log("commentsRes.data: ", commentsRes.data);
                        self.title = imageRes.data[0].title;
                        self.url = imageRes.data[0].url;
                        self.description = imageRes.data[0].description;
                        self.username = imageRes.data[0].username;
                        self.created_at = imageRes.data[0].created_at;
                        self.comments = commentsRes.data;
                    })
                );
        },
        methods: {
            handleClick: function (e) {
                console.log("clicked submit comments button!");
                e.preventDefault();
                var self = this;

                console.log("this:", this);
                var newComment = {};
                newComment.comment = this.comment;
                newComment.username = this.username;
                newComment.image_id = this.id;
                console.log("newComment:", newComment);
                axios
                    .post("/comment", newComment)
                    .then(function (resp) {
                        console.log("resp from POST /comment:", resp);
                        console.log("res.data:", resp.data);
                        self.comments.unshift(resp.data);
                    })
                    .catch(function (err) {
                        console.log("err in POST /comment:", err);
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
            id: null,
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
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
                this.selectedImage = null;
            },
        },
    });
})();
