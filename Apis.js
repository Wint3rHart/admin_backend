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

let multer_mw = multer({ storage: multer.memoryStorage() });
// multer({storage:multer.diskStorage({destination:(req,file,cb)=>{cb(null,'') },filename:(req,file,cb)=>{cb(null,file.originalname)}})})


router.route("/register").post(multer_mw.single("pic"), register);
router.route("/signIn").post(signIn_mw,signIn);

app.use("/api",router);
app.use((err,req,res,next)=>{res.status(400).send(err.message)});

app.listen(4700,()=>{console.log("server running");
})

