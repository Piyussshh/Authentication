var mongoose 			  = require("mongoose"),
	express  			  = require("express"),
	passport 			  = require("passport"),
	bodyParser		      = require("body-parser"),
	User	   			  = require("./models/user"),
	LocalStrategy	      = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose");
	

	
	

var app      = express();
mongoose.connect("mongodb://localhost/auth_app");

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(require("express-session")({
	secret:"Rusty is the best and cutest dog in the world",
	resave:false,
	saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate())); //passport-local
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//========================
//ROUTES
//========================




app.get("/",function(req,res){
	res.render("home");
});

app.get("/secret",isLoggedIn,function(req,res){
	res.render("secret");
});

//auth routes

//show sign up form
app.get("/register",function(req,res){
	res.render("register");
});

//handling user signup

app.post("/register",function(req,res){
	  req.body.username
	  req.body.password
       User.register(new User({username:req.body.username}),req.body.password,function(err,user){
		   if(err)
			   {
				   console.log(err);
			   }
		   passport.authenticate("local")(req,res,function(){ // this line will be used for logging in an then direct to secret page!!
			   res.redirect("/secret");
		   });
	   });
});

//login form
app.get("/login",function(req,res){
	res.render("login");
});

//handling login form

app.post("/login",passport.authenticate("local",{
	successRedirect:"/secret",
	failureRedirect:"/login"
	
}),function(req,res){
	
});

//logout form

app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/");
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};



app.listen(process.env.PORT||3000,process.env.IP,function(){
	console.log("server started!!");
});
