const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 5000;
const bodyParser = require("body-parser");
const cors = require("cors");

let mylist = [{ id: 1, value: "Raja Kumar" }];


app.use(cors());


// app.use((req, res, next) => {
//   debugger;
//   // Replace 'http://allowed-origin.com' with the origin you want to allow
//   const allowedOrigin = 'http://127.0.0.1:5500';

//   // Check if the request's origin is allowed
//   if (req.headers.origin === allowedOrigin) {
//     res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     res.setHeader('Access-Control-Allow-Credentials', 'true');
//     next();
//   } else {
//     // Handle unauthorized origin (e.g., return an error response)
//     res.status(403).json({ error: 'Unauthorized origin' });
//   }
// });


app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});


// Authentication middleware
const authenticate = (req, res, next) => {
  console.log(req.headers);
  debugger;
  const authHeader = req.headers["authorization"];
  debugger;
  if (!authHeader || authHeader !== "Bearer 123") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();

};


app.get("/api/list", (req, res) => {
  debugger;
  res.json(mylist);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



app.get("/api/list/:id", (req, res) => {
  debugger;
  const listItemID = parseInt(req.params.id);
  console.log(`Listing ${listItemID}`);
  let listItem = mylist.find((listItem) =>  parseInt(listItem.id) === listItemID );
    if (!listItem) {
    return res.status(404).json({ error: "Item not found" });
    }
  res.json(listItem);
});

app.post("/api/list", authenticate, (req, res) => {
  const { value } = req.body;
  debugger;
  let nextId = { id: mylist.length + 1, value };
  mylist.push(nextId);
  res.status(201).json(mylist);
});


app.put("/api/list/:id", authenticate, (req, res) => {

  debugger;

  const listItemID = parseInt(req.params.id);
  const itemIndex =  mylist.findIndex((item) => parseInt(item.id) === listItemID);

  if(itemIndex === -1)
  {
    return res.status(404).json({ error: "Item not found" });
  }
  const updatedItem = { ...mylist[itemIndex], ...req.body };
  mylist[itemIndex] =  updatedItem;
  res.json(mylist);
})

app.delete("/api/list/:id", (req, res) => {
  const listItemID = parseInt(req.params.id);
  mylist = mylist.filter((listItem) => {
    return parseInt(listItem.id) != listItemID;
  });
  res.json({ message: "Item deleted successfully" });
});
