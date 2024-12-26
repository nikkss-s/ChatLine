const exp = require("express");
const conversationsApp = exp.Router();
//const multerObj = require('./cloudinaryConfig')
const mongo = require("mongodb");
const Grid = require("gridfs-stream");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const { GridFsStorage } = require("multer-gridfs-storage");
const url = process.env.DB;

const multer = require("multer");

const storage = new GridFsStorage({
  url: url,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  file: (req, file) => {
    return {
      filename: "file-" + Date.now() + "-" + file.originalname,
    };
  },
});

const multerObj = multer({ storage });

const expressAsyncHandler = require("express-async-handler");

conversationsApp.use(exp.json());
conversationsApp.use(bodyParser.json());

conversationsApp.post(
  "/get-messages",
  expressAsyncHandler(async (req, res) => {
    const conversationsCollectionObj = req.app.get(
      "conversationsCollectionObj"
    );

    let messagesList = await conversationsCollectionObj
      .find({
        $or: [
          {
            $and: [
              { senderId: req.body.host },
              { receiverId: req.body.person },
            ],
          },
          {
            $and: [
              { senderId: req.body.person },
              { receiverId: req.body.host },
            ],
          },
        ],
      })
      .toArray();

    res.status(200).send({ message: "Conversation", chat: messagesList });
  })
);

conversationsApp.post(
  "/send-message",
  expressAsyncHandler(async (req, res) => {
    const conversationsCollectionObj = req.app.get(
      "conversationsCollectionObj"
    );

    const newMessage = req.body;

    let response = await conversationsCollectionObj.insertOne(newMessage);

    res.status(200).send({ success: true, message: "Message Sent" });
  })
);

conversationsApp.post(
  "/send-file",
  multerObj.single("file"),
  expressAsyncHandler(async (req, res) => {
    const conversationsCollectionObj = req.app.get(
      "conversationsCollectionObj"
    );

    const newMessage = JSON.parse(req.body.details);

    newMessage.fileType = req.file.mimetype;

    newMessage.filename = req.file.filename;

    try {
      await conversationsCollectionObj.insertOne(newMessage);
      res.status(200).send({ success: true, message: "File Sent.." });
    } catch (err) {
      res.status(400).send({ message: "Error occured while Sending File.." });
    }
  })
);

conversationsApp.post(
  "/download-file",
  expressAsyncHandler(async (req, res) => {
    const dbObj = req.app.get("dbObj");
    const bucket = new mongo.GridFSBucket(dbObj, { bucketName: "fs" });

    let gfs = Grid(dbObj, mongo);
    gfs.collection("fs");

    try {
      const file = await gfs.files.findOne({ filename: req.body.filename });

      res.set("Content-Type", file.contentType);
      res.set("Content-Disposition", `attachment; filename = ${file.filename}`);

      let readstream = bucket.openDownloadStream(file._id);
      readstream.pipe(res);
    } catch (err) {
      res.status(400).send({
        message:
          "Error while Downloading the file.. Consider re-downloading or re-sending..",
      });
    }
  })
);

conversationsApp.post(
  "/delete-message",
  expressAsyncHandler(async (req, res) => {
    const conversationsCollectionObj = req.app.get(
      "conversationsCollectionObj"
    );

    try {
      await conversationsCollectionObj.deleteOne({
        _id: new mongo.ObjectId(req.body._id),
      });
      res.status(201).send({ success: true, message: "Message Deleted.." });
    } catch (err) {
      res.status(400).send({ message: "Error while Deleting Message" });
    }
  })
);

module.exports = conversationsApp;