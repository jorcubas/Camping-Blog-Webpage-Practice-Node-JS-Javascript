var express = require("express");
var app = express()
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function(req, res){
	res.render("landing");
});

var campgrounds = [
		{name: "Salmon Creek", image: "https://cdn.hiconsumption.com/wp-content/uploads/2019/07/Best-Affordable-Camping-Gear-000-Hero.jpg"},
		{name: "Prusia", image: "https://inteng-storage.s3.amazonaws.com/img/iea/MRw4y5ABO1/sizes/camping-tech-trends_resize_md.jpg"},
		{name: "Laguna de Apoyo", image: "https://www.reserveamerica.com/webphotos/racms/articles/images/bca19684-d902-422d-8de2-f083e77b50ff_image2_GettyImages-677064730.jpg"}
	]

app.get("/campgrounds", function(req, res){
	res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res){
// 	getdata from form and add campgrounds to array 
	var name = req.body.name;
	var image = req.body.image;
	var newCampground = {name: name, image: image}
	campgrounds.push(newCampground);
// 	redirect to campgrounds page 
// 	default es redirect a get request 
	res.redirect("/campgrounds")
});

app.get("/campgrounds/new", function(req, res){
	res.render("new.ejs")
});

app.listen(3000, function(){
	console.log("YelpCamp server is now running")
});
