let express = require("express");
let app = express();
let cors=require("cors");
app.use(cors())
// let fs=require("fs");
// let path=require("path")
let router = express.Router();
let multer = require("multer");
let { register} = require("./registration_controller");
let multer_mw = multer({ storage: multer.memoryStorage() });
// multer({storage:multer.diskStorage({destination:(req,file,cb)=>{cb(null,'') },filename:(req,file,cb)=>{cb(null,file.originalname)}})})


router.route("/register").post(multer_mw.single("pic"), register);

app.use("/api",router);
app.use((err,req,res,next)=>{res.status(400).send(err.message)});

app.listen(4700,()=>{console.log("server running");
})

