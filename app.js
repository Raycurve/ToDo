//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static("public"));
var item = ["Study","Music","Eat"];
app.get("/", function(req, res){
  var d = new Date();
  var opn ={
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  d = d.toLocaleDateString("en-US",opn);
  res.render("list",{mark: d, itm: item});
});

app.post("/",(req,res)=>{
  console.log("add");
  item.push(req.body.task);
  res.redirect("/");
})

app.post("/reset",(req,res)=>{
  console.log("reset");
  item = [];
  res.redirect("/");
})


app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
