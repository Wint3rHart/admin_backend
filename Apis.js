let express = require("express");
let app = express();
app.use(express.json())
let cors=require("cors");
app.use(cors({origin:'http://localhost:5173',credentials:true}))
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// let fs=require("fs");
// let path=require("path")
let router = express.Router();
let multer = require("multer");
let { register,signIn,signIn_mw} = require("./registration_controller");
const { make_access, new_access, login_mw, login } = require("./tokens");

let multer_mw = multer({ storage: multer.memoryStorage() });
// multer({storage:multer.diskStorage({destination:(req,file,cb)=>{cb(null,'') },filename:(req,file,cb)=>{cb(null,file.originalname)}})})


router.route("/register").post(multer_mw.single("pic"), register);
router.route("/signIn").post(signIn_mw,signIn);
router.route("/refresh").post(make_access,new_access);
router.route("/login").get(login_mw,login);
app.use("/api",router);
app.use((err,req,res,next)=>{console.log("from global handler",err||err.message);
;res.status(400).send({msg:err.message||err})});

app.listen(4700,()=>{console.log("server running");
})

//need token expiry in mongodb,improve error handler, global one,token rotation .