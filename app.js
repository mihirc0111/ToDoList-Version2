//Latest working using atlas connection by application method and using process.env.PORT
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
//Added by me which is not present in Lecture(IMP !!!!!)
const request=require("request");
const cors = require('cors')
require("dotenv").config();
app.use(bodyParser.json());
app.use(cors())
// require these installations for env file to protect password(IMP!!!!!)
//npm i require body-parser cors dotenv
 
main().catch((err) => console.log("err"));
 
 
const app = express();
 
app.set('view engine', 'ejs');
 
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

 
 
async function main() {
  const password = process.env.password;
  await mongoose.connect("mongodb+srv://admin-mihir:"+password+"@cluster0.l3cmxol.mongodb.net/todolistDB");
}
 
const itemsSchema = new mongoose.Schema({
  name: String
});
 
const Item = mongoose.model("Item", itemsSchema);
 
const item1 = new Item({
  name: "Welcome to your To Do List",
});
 
const item2 = new Item({
  name: "Hit the + button to add new item.",
});
 
const item3 = new Item({
  name: "<-- Hit this to delete item.",
});
 
const defaultItems = [item1,item2,item3];
 
const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
});
 
const List = mongoose.model("List", listSchema);
 
app.get("/", function(req, res) {
 
  Item.find({})
    .then(data => {
      
      if(data.length === 0){
        Item.insertMany(defaultItems).then(function(){
          console.log("Sucessful");
        }) .catch(function(err){
          console.log("err");
        });
        res.redirect("/");   
      }
      else{
        res.render("list", {listTitle: "Today", newListItems: data});
      }
 
    })
    .catch(err => {
      console.error(err); 
   });
 
});
 
 
 
 
app.get("/:findPath",function(req,res){
 
  const userPath = req.params.findPath;
  List.findOne({name: userPath})
  .then(function(result){
    
    if ( result === null){
      const createlist = new List({
 
        name: userPath,
        items: defaultItems
      });
      createlist.save();
 
      res.redirect("/" + userPath);
    } else{
      res.render("list", {listTitle: result.name , newListItems: result.items});
    }
  })
  .catch(function (e){
    console.log(e);
  })
});
 
app.post("/", function(req, res){
 
  const itemName = req.body.newItem;
  const listName = req.body.list;
 
  const item4 = new Item({
    name: itemName
  });
 
  if(listName === "Today"){
    item4.save(); 
    res.redirect("/");
  } else{
    List.findOne({name: listName})
    .then(function(result){
      result.items.push(item4);
      result.save();
    })
    .catch(function (e){
      console.log(e);
    });
    res.redirect("/" + listName);
  }
});
 
 
app.post("/delete", function(req,res){
  const checkedItemID = req.body.checkbox;
  const listName = req.body.listName;
 
  if ( listName === "Today"){
    Item.findByIdAndRemove(checkedItemID).then(function(){
      console.log("Sucessful removed");
    }) .catch(function(err){
      console.log("err");
    }); 
  
    res.redirect("/");
  } 
  
  else {
    List.findOneAndUpdate({name: listName}, {$pull:{ items:{_id:checkedItemID }}}, {new: true}).then(function(foundlist){
      res.redirect("/" + listName);
    }).catch( err => console.log(err));
    
}
 
 
  
});
 
 
app.get("/about", function(req, res){
  res.render("about");
});
 

//To choose deafault port provided by hosting platform
let port=process.env.PORT;
if(port==null || port ==""){
    port=3000;
}
app.listen(port, function () {
    console.log("Server is running on port 3000 or "+port);
    });
 