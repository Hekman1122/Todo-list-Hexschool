const http = require("http");
const { v4: uuidv4 } = require("uuid");
const { errorHandler, successHandler } = require("./helper");
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
  const headers = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
    "Content-Type": "application/json",
  };

  //接收 post 而來的資料集,該資料為Buffer物件
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  //GET
  if (req.url === "/todos" && req.method === "GET") {
    const data = await Post.find({});
    successHandler(res, data);
  }
  //POST
  else if (req.url === "/todos" && req.method === "POST") {
    req.on("end", () => {
      try {
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
      } catch (e) {
        errorHandler(res, e);
      }
    });
  }
  //OPTIONS preflight check
  else if (req.method === "OPTIONS") {
    res.writeHead(200, headers);
    res.end();
  } else {
    //Invalid request path.
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: "Failed",
        message: "Invalid request path.",
      })
    );
    res.end();
  }
};

const server = http.createServer(reqListener);
server.listen(process.env.PORT || 3000);
