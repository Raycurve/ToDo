//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const app = express();
const _ = require('lodash');
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static("public"));
// var item = ["Study","Music","Eat"];

mongoose.connect("mongodb://localhost:27017/todolistDB")

const itemSchema =new mongoose.Schema({
  name: String
});
const Item = mongoose.model("items",itemSchema);

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
})
const List = mongoose.model("list",listSchema);


const task1 = new Item({
  name:"Hey! Add items here"
})
const task2 = new Item({
  name:"List names will appear here :)"
})
const task3 = new Item({
  name:"task3"
})

const defaultItems = [task1];
const defaultLists = [task2];
var d = new Date();
const opn ={
  weekday: "long",
  day: "numeric",
  month: "long"
};
d = d.toLocaleDateString("en-US",opn);

var li=defaultLists;

app.get("/", function(req, res){

  Item.find()
  .then((items)=>{
    if(items.length==0){
      //default
      Item.insertMany(defaultItems);
      res.redirect("/");
    }
    else{
      List.find({})
      .then((items)=>{
      if(items.length==0){
        li= defaultLists;

      }else{
        li = items;
      }

      Item.find()
      .then((itemList)=>{
          res.render("list",{mark: d, itm: itemList, listsname: li})
        })
      })
    }


  })

});

app.get("/:field",(req,res)=>{
  // console.log(req.params.field);
  List.findOne({ name: _.capitalize(req.params.field) })
  .then((item) => {
    if (item) {
      return List.find({});
    } else {
      const list = new List({
        name: _.capitalize(req.params.field),
        items: defaultItems,
      });
      return list.save().then(() => List.find({}));
    }
  })
  .then((items) => {
    res.render("list", {
      mark: _.capitalize(req.params.field),
      itm: items.filter((item) => item.name === _.capitalize(req.params.field))[0]?.items || [],
      listsname: items,
    });
  })
  // .then((item)=>{
  //     if(item){
  //       // console.log("found one" + item);
  //       List.find({})
  //       .then((items)=>{
  //           li = items;
  //       })
  //       .then(
  //         res.render("list", {mark : item.name, itm: item.items, listsname: li})
  //       )
  //     }
  //     else{
  //       const list = new List({
  //         name: req.params.field,
  //         items: defaultItems
  //       });
  //       list.save()
  //       .then(
  //         res.redirect("/"+req.params.field)
  //       )
  //     }
  // })

})

app.post("/",(req,res)=>{
  console.log("add");
  const itemName = req.body.task;
  const listName = req.body.submit;
  const ad = new Item({name:itemName});
  if(listName == d){
    ad.save();
    // item.push(req.body.task);
    res.redirect("/");
  }
  else{
    List.findOne({name: req.body.submit})
    .then((list)=>{
      list.items.push(ad);
      list.save();
      res.redirect("/"+ listName);
    })
  }

})

app.post("/delete",(req,res)=>{
  const itemName = req.body.check;
  const listName = req.body.listname;
  // console.log(listName + " "+ itemName);
  if(listName == d){
    Item.findOneAndDelete({_id: itemName})
    .then(res.redirect("/"));
  }
  else{
    List.findOneAndUpdate({name: listName},{$pull :{items:{_id:itemName}}})
    .then(res.redirect("/"+listName))
    .catch((err)=>{
      console.log(err);
    })
  }


})

app.post("/reset",(req,res)=>{
  console.log("reset");
  const list = req.body.button;
  if(list == d){
    Item.deleteMany({})
    .then(res.redirect("/"));
  }
  else{
    List.deleteOne({name: list})
    .then(res.redirect("/"+list));
  }


})

app.post("/delList",(req,res)=>{
  const list = req.body.button;
  List.deleteOne({name: list})
  .then(res.redirect("/"));
})

app.post("/addList",(req,res)=>{
  const name = req.body.list;
  res.redirect("/"+name);
})

app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
