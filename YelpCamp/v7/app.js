var express 		= 	require("express"),	
	app 			= 	express(),
	mongoose 		= 	require("mongoose"),
	passport		=	require("passport"),
	LocalStrategy	= 	require("passport-local"),
	bodyParser 		= 	require("body-parser"),
	Campground		=	require("./models/campgrounds"),
	Comment			=	require("./models/comment"),
	User			=	require("./models/user"),
	seedDB 			=	require("./seeds");

// Requiring Routes
	var commentRoutes 		= 	require("./routes/comments"),
		campgroundRoutes	=	require("./routes/campgrounds"),
		indexRoutes 			= 	require("./routes/index");

seedDB();
mongoose.connect("mongodb://localhost/yelpcamp_v6");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
console.log(__dirname);
// seedDB(); Seedd the Database

// PASSPORT CONFIG
app.use(require("express-session")({
	secret: "Sign In Secret",
	resave: false, 
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});


app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, function(){
	console.log("YelpCamp server is now running")
});
