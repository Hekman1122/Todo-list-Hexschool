const headers = {
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, Content-Length, X-Requested-With",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
  "Content-Type": "application/json",
};

function errorHandler(res, error) {
  let message = "";
  if (error) {
    message = error.message;
  } else {
    message = "欄位未填寫正確或查無此 id";
  }
  res.writeHead(400, headers);
  res.write(
    JSON.stringify({
      status: "Request failed.",
      message,
    })
  );
  res.end();
}

function successHandler(res, data) {
  res.writeHead(200, headers);
  res.write(
    JSON.stringify({
      status: "success",
      data: data,
    })
  );
  res.end();
}

function validateUrl(url) {
  const regex = /^\/posts\/.*$/;
  return regex.test(url);
}

module.exports = { errorHandler, successHandler, headers, validateUrl };
