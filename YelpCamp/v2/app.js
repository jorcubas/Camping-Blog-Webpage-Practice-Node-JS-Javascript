var express 	= 	require("express"),	
	app 		= 	express(),
	mongoose 	= 	require("mongoose"),
	bodyParser 	= 	require("body-parser");

mongoose.connect("mongodb://localhost/yelpcamp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Schema Setup
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String, 
	description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
// 	{
// 		name: "Prusia",
// 		image: "https://inteng-storage.s3.amazonaws.com/img/iea/MRw4y5ABO1/sizes/camping-tech-trends_resize_md.jpg"	,
// 		description: "Este es el hermoso parque de Prusia de Cartago, Costa Rica. No tiene baños cercanos."
// 	}, function(err, campground){
// 		if(err){
// 			console.log(err);
// 		}
// 		else{
// 			console.log("NEWLY CREATED CAMPGROUND");
// 			console.log(campground);
// 		}
// 	});

var campgrounds = [
		{name: "Salmon Creek", image: "https://cdn.hiconsumption.com/wp-content/uploads/2019/07/Best-Affordable-Camping-Gear-000-Hero.jpg"},
		{name: "Prusia", image: "https://inteng-storage.s3.amazonaws.com/img/iea/MRw4y5ABO1/sizes/camping-tech-trends_resize_md.jpg"},
		{name: "Laguna de Apoyo", image: "https://www.reserveamerica.com/webphotos/racms/articles/images/bca19684-d902-422d-8de2-f083e77b50ff_image2_GettyImages-677064730.jpg"}
	]


app.get("/", function(req, res){
	res.render("landing");
});

app.get("/campgrounds", function(req, res){
// 	Get All Campgrounds from DB 
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}
		else{
			res.render("index", {campgrounds: allCampgrounds});
		}
	});
	// res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res){
// 	getdata from form and add campgrounds to array 
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = {name: name, image: image, description: desc}
// 	Create a New Campaground and Save to DataBase
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/campgrounds")		
		}
	});
// 	redirect to campgrounds page 
// 	default es redirect a get request 
	
});

app.get("/campgrounds/new", function(req, res){
	res.render("new.ejs")
});

app.get("/campgrounds/:id", function(req, res){
// 	Find the Campground With Provided ID 
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log("error fin by id");
		}
		else{
			
			// 	Render the show tempalate with that campground
			res.render("show", {campground: foundCampground});
		}
	});

});

app.listen(3000, function(){
	console.log("YelpCamp server is now running")
});
