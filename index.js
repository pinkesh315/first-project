const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const {v4: uuidv4} = require("uuid");
const methodOverride = require("method-override");
const multer = require("multer");

const fs = require('fs');
const uploadDir = path.join(__dirname, 'public/uploads');

// Create uploads folder if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, date.now() + "-" + file.originalname);
    }
});

const upload = multer({dest: "uploads/",
    limits:{fileSize: 5 * 1024 * 1024}
});

app.use(express.urlencoded({ extended: true}));
app.use(methodOverride('_method'));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));


let posts = [
    {
        id: uuidv4(),
        username: "stev",
        content: "t is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
    },
    {
        id: uuidv4(),
        username: "Eve",
        content: "i'm pro coder",
    },
    {
        id: uuidv4(),
        username: "User Name",
        content: "i'm full-stack devloper",
    },
];

app.get("/posts", (req, res) => {
    res.render("index.ejs", {posts} );
});

app.get("/posts/new", (req, res) => {
    res.render("new.ejs");
})

app.post("/posts", upload.single("image"), (req, res) => {
    // console.log(req.file);
     let {username, content} = req.body;
    //  console.log(req.body);
     let id = uuidv4();
     let image = req.file ? req.file.filename : null;
     posts.push({id, username, content, image});
    res.redirect("/posts");
});

app.get("/posts/:id", (req, res) => {
    let {id} = req.params;
    let post = posts.find((p) => id === p.id);
    res.render("show.ejs", {post});
});

app.patch("/posts/:id", (req, res) => {
    let {id} = req.params;
    let newContent = req.body.content;
    let post = posts.find((p) => id === p.id);
    post.content = newContent;
    console.log(post);
    res.redirect("/posts");
});

app.delete("/posts/:id", (req, res) => {
    let {id} = req.params;
     posts = posts.filter((p) => id !== p.id);
     res.redirect("/posts");
})

app.get("/posts/:id/edit", (req, res) => {
    let {id} = req.params;
    let post = posts.find((p) => id === p.id);
    res.render("edit.ejs", {post});
})

app.listen(port, () => {
    console.log("listening to port : 8080");
});


