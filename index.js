const http = require("http");
const { errorHandler, successHandler, headers } = require("./helper");
const mongoose = require("mongoose");
require("dotenv").config();
const Post = require("./model/postSchema");

//mongoose connect
mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => {
    console.log("成功連接資料庫");
  })
  .catch((e) => {
    console.log(e);
  });

const reqListener = async (req, res) => {
  //接收 post 而來的資料集,該資料為Buffer物件
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  //GET
  if (req.url === "/posts" && req.method === "GET") {
    try {
      const data = await Post.find({});
      successHandler(res, data);
    } catch (e) {
      errorHandler(res, e);
    }
  }
  //POST
  else if (req.url === "/posts" && req.method === "POST") {
    req.on("end", () => {
      const data = JSON.parse(body);
      if (data.name) {
        Post.create({
          name: data.name,
          tags: data.tags,
          image: data.image,
          content: data.content,
          type: data.type,
        })
          .then((result) => {
            successHandler(res, result);
          })
          .catch((e) => {
            errorHandler(res, e);
          });
      } else {
        errorHandler(res);
      }
    });
  }
  //DELETE ALL
  else if (req.url === "/posts" && req.method === "DELETE") {
    try {
      const data = await Post.deleteMany({});
      successHandler(res, data);
    } catch (e) {
      errorHandler(res, e);
    }
  }
  //DELETE target
  else if (req.url.startsWith("/posts/") && req.method === "DELETE") {
    const id = req.url.split("/").pop();
    let target = await Post.findById(id);
    if (target) {
      try {
        const data = await Post.findByIdAndDelete(id);
        successHandler(res, data);
      } catch (e) {
        errorHandler(res, e);
      }
    } else {
      errorHandler(res);
    }
  }
  //PATCH
  else if (req.url.startsWith("/posts/") && req.method === "PATCH") {
    const id = req.url.split("/").pop();
    let target = await Post.findById(id);
    if (target) {
      req.on("end", async () => {
        const data = JSON.parse(body);
        if (data.name || data.type || data.content || data.tags || data.image) {
          try {
            const result = await Post.findByIdAndUpdate(id, data, {
              new: true,
            });
            successHandler(res, result);
          } catch (e) {
            errorHandler(res, e);
          }
        } else {
          errorHandler(res);
        }
      });
    } else {
      errorHandler(res);
    }
  }
  //OPTIONS preflight check
  else if (req.method === "OPTIONS") {
    res.writeHead(200, headers);
    res.end();
  } else {
    errorHandler(res);
  }
};

const server = http.createServer(reqListener);
server.listen(process.env.PORT || 3000);
