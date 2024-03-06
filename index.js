import { v4 as uuidv4 } from "uuid";
import http from "http";

const PORT = 3000;
const HOST = "127.0.0.1";

/*users varijabla*/
const user = [
  { id: "f5e43e53-d59f-4b0a-9beb-3efe19297e87", name: "Lejla", age: 20 },
  { id: "e1622eed-6cde-489a-88ea-377ec4f6f43f", name: "Zlatan", age: 27 },
  { id: "4b239661-d230-440e-b2f9-b7bb8064c468", name: "Tarik", age: 24 },
];

const sendRequest = (res, statusCode, data) => {
  res.statusCode = statusCode;
  res.end(typeof data === "string" ? data : JSON.stringify(data));
};

const handleGetRequest = (req, res) => {
  const { url } = req;
  if (url === "/") {
    sendRequest(res, 200, "Healthy");
  } else if (url === "/user") {
    sendRequest(res, 200, user);
  } else if (url.includes("/user")) {
    const id = url.split("/").pop();
    const userId = user.find((use) => use.id === id);

    if (userId) {
      sendRequest(res, 200, userId);
    } else {
      sendRequest(res, 404, "Not found!!");
    }
  } else {
    sendRequest(res, 404, "Route is not found");
  }
};

const handlePostRequest = (req, res) => {
  let body = "";
  const { url } = req;

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    const parseData = JSON.parse(body);
    if (url === "/user") {
      const useri = {
        ...parseData,
        id: uuidv4(),
      };

      user.push(useri);
      sendRequest(res, 201, useri);
    } else {
      sendRequest(res, 404, "User is not found");
    }
  });
};

const handlePutRequest = (req, res) => {
  let body = "";
  const { url } = req;

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    const parseData = JSON.parse(body);
    const id = url.split("/").pop();
    console.log(id);

    const findIndex = user.findIndex((useri) => useri.id === id);

    user[findIndex] = parseData;

    sendRequest(res, 200, "User updated successfully");
  });
};

const handleDeleteRequest = (req, res) => {
  const { url } = req;
  const id = url.split("/").pop();

  const findIndex = user.findIndex((useri) => useri.id === id);

  if (findIndex !== -1) {
    user.splice(findIndex, 1);

    sendRequest(res, 204, "No content");
  } else {
    sendRequest(res, 404, "User not found");
  }
};

const handlePatchRequest = (req, res) => {
  let body = "";
  const { url } = req;
  const id = url.split("/").pop();

  /* ovo su listeneri*/
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    const data = JSON.parse(body);

    const userIndex = user.findIndex((useri) => useri.id === id);

    if (userIndex !== -1) {
      user[userIndex] = {
        ...user[userIndex],
        ...data,
      };

      sendRequest(res, 200, user[userIndex]);
    }else{
      sendRequest(res,404,"Error!")
    }
  });
};

const server = http.createServer((req, res) => {
  if (req.method === "GET") {
    handleGetRequest(req, res);
  } else if (req.method === "POST") {
    handlePostRequest(req, res);
  } else if (req.method === "PUT") {
    handlePutRequest(req, res);
  } else if (req.method === "DELETE") {
    handleDeleteRequest(req, res);
  } else if (req.method === "PATCH") {
    handlePatchRequest(req, res);
  }
});

server.listen(PORT, HOST, () => {
  console.log("Server je pokrenut na portu", PORT);
});
