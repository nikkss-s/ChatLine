const exp = require("express");
const dotenv = require("dotenv").config();
const app = exp();
const cors = require("cors");
const path = require("path");
app.use(exp.static(path.join(__dirname, "./build")));
app.use(cors());
const { MongoClient } = require("mongodb");

const PORT = process.env.PORT || 3500;
const http = require("http");
const server = http.createServer(app);

server.listen(PORT, () => console.log("server listening on port 3500..."));

const { Server } = require("socket.io");
const io = new Server(server);

const userApp = require("./APIs/usersAPI");
app.use("/user-api", userApp);

const conversationsApp = require("./APIs/conversationsAPI");

app.use("/conversation-api", conversationsApp);

const MONGODB_URI = process.env.MONGODB_URI;
const client = new MongoClient(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let onlineUsersCollectionObj = null;

client
  .connect()
  .then(async (dbRef) => {
    const dbObj = dbRef.db("chatline");
    const dbTest = dbRef.db("test");
    const usersCollectionObj = dbObj.collection("usersCollection");
    const conversationsCollectionObj = dbObj.collection(
      "conversationsCollection"
    );
    onlineUsersCollectionObj = dbObj.collection("onlineUsersCollection");
    app.set("usersCollectionObj", usersCollectionObj);
    app.set("conversationsCollectionObj", conversationsCollectionObj);
    app.set("onlineUsersCollectionObj", onlineUsersCollectionObj);
    app.set("dbObj", dbObj);
    app.set("dbTest", dbTest);

    console.log("DB Connection Success..");
  })
  .catch((err) => console.log("DB error" + err));

io.on("connection", (socket) => {
  socket.on("new-connection", async (newUser) => {
    const userObj = { username: newUser };
    const isExists = await onlineUsersCollectionObj.findOne(userObj);
    if (!isExists) await onlineUsersCollectionObj.insertOne(userObj);
    const allUsers = await onlineUsersCollectionObj.find().toArray();
    io.emit("allusers", allUsers);
  });
  socket.on("reload", async () => {
    const allUsers = await onlineUsersCollectionObj.find().toArray();
    socket.emit("allusers", allUsers);
  });
  socket.on("remove-user", async (user) => {
    let userObj = { username: user };
    await onlineUsersCollectionObj.deleteOne(userObj);
    const allUsers = await onlineUsersCollectionObj.find().toArray();
    io.emit("allusers", allUsers);
  });
  socket.on("disconnect", () => {});
  socket.on("message-sent", (data) => {
    io.emit("message-sent", data);
  });
  socket.on("delete-message", (data) => {
    io.emit("delete-message", data);
  });
  socket.on("typing", (data) => {
    io.emit("typing", data);
  });
  socket.on("not-typing", (data) => {
    io.emit("not-typing", data);
  });
});

const pageRefresh = (req, res, next) => {
  res.sendFile(path.join(__dirname, "./build/index.html"));
};
app.use("*", pageRefresh);

const invalidPathMiddleware = (req, res, next) => {
  res.send({ message: "Invalid Path" });
};
app.use(invalidPathMiddleware);

const errhandlingMiddleware = (error, req, res, next) => {
  res.send({ message: error.message });
};
app.use(errhandlingMiddleware);
