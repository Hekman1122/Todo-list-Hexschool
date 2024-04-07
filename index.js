const http = require("http");
const { v4: uuidv4 } = require("uuid");
const errorHandler = require("./helper");

const todos = [
  {
    id: "456123",
    title: "今天洗衣服",
  },
  {
    id: "123456",
    title: "今天整理房間",
  },
  {
    id: "111222",
    title: "今天逛街",
  },
  {
    id: "333444",
    title: "今天看電影",
  },
];
const reqListener = (req, res) => {
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
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: "Get request succeeded",
        data: todos,
      })
    );
    res.end();
  }
  //POST
  else if (req.url === "/todos" && req.method === "POST") {
    req.on("end", () => {
      try {
        const { title } = JSON.parse(body);
        if (title !== undefined) {
          let newTodo = { title, id: uuidv4() };
          todos.push(newTodo);
          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              status: "Post request succeeded.",
              data: todos,
            })
          );
          res.end();
        } else {
          errorHandler(res);
        }
      } catch (e) {
        errorHandler(res);
      }
    });
  }
  //DELETE
  else if (req.url === "/todos" && req.method === "DELETE") {
    todos.length = 0;
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: "Delete all todos request succeeded",
        data: todos,
      })
    );
    res.end();
  }
  //DELETE Single todo
  else if (req.url.startsWith("/todos/") && req.method === "DELETE") {
    //取得代辦事項 id
    const id = req.url.split("/").pop();
    const targetIndex = todos.findIndex((todo) => todo.id === id);
    if (targetIndex !== -1) {
      todos.splice(targetIndex, 1);
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          status: "Delete single todo request succeeded",
          data: todos,
        })
      );
      res.end();
    } else {
      errorHandler(res);
    }
  }
  //PATCH
  else if (req.url.startsWith("/todos/") && req.method === "PATCH") {
    req.on("end", () => {
      try {
        //取得代辦事項 id
        const id = req.url.split("/").pop();
        const targetIndex = todos.findIndex((todo) => todo.id === id);
        //取得代辦事項新的資料
        const { title: newTitle } = JSON.parse(body);
        if (newTitle !== undefined && targetIndex !== -1) {
          todos[targetIndex].title = newTitle;
          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              status: "Delete single todo request succeeded",
              data: todos,
            })
          );
          res.end();
        } else {
          errorHandler(res);
        }
      } catch (e) {
        errorHandler(res);
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
