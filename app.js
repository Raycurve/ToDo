//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static("public"));
// var item = ["Study","Music","Eat"];

mongoose.connect("mongodb://localhost:27017/todolistDB")
const itemSchema =new mongoose.Schema({
  name: String
});
const Item = mongoose.model("items",itemSchema);





app.get("/", function(req, res){
  var d = new Date();
  var opn ={
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  d = d.toLocaleDateString("en-US",opn);

  Item.find()
  .then((items)=>{
    if(items.length==0){
      //default
      const task1 = new Item({
        name:"task1"
      })
      const task2 = new Item({
        name:"task2"
      })
      const task3 = new Item({
        name:"task3"
      })
      Item.insertMany([task1,task2,task3]);
      res.redirect("/");
    }

    res.render("list",{mark: d, itm: items});
  })

});

app.post("/",(req,res)=>{
  console.log("add");
  const itemName = req.body.task;
  const ad = new Item({name:itemName});
  ad.save();
  // item.push(req.body.task);
  res.redirect("/");
})

app.post("/delete",(req,res)=>{
  Item.findOneAndDelete({_id: req.body.check})
  .then(res.redirect("/"));

})

app.post("/reset",(req,res)=>{
  console.log("reset");
  item = [];
  res.redirect("/");
})


app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
