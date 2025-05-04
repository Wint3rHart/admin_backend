
let {user_model}=require("./models");
let bcrypt=require("bcrypt");
let jwt=require("jsonwebtoken");
let cookie=require("cookie-parser");
const { default: mongoose } = require("mongoose");
const key="125xyz";
const generate_access=(x)=>{ return jwt.sign(x,key,{expiresIn:"2m"}) }
const generate_refresh=(x)=>{return jwt.sign(x,key,{expiresIn:"24h"})}
// const del=async()=> await user_model.deleteMany({})
const register=async(req,res)=>{

console.log(req.file);


    try {
        let get=new user_model({name:req.body.name,email:req.body.email,password:req.body.password,profilePic:req.file.buffer.toString("base64")});
        await get.save();
        res.status(200).send({msg:"user registered"})
    } catch (error) {console.log(error,error.message);
    
        res.status(401).send(error.message);
    }
};

const signIn_mw=async(req,res,next)=>{
console.log("signreq recieved");
console.log(req.body);

try{
    
    const get=await user_model.findOne({name:req.body.name});

   
    
    if(get){ if(get.email!=req.body.email){return  next(new Error("invalid email")) } else if(!bcrypt.compareSync(req.body.password,get.password)){return next(new Error("wrong password"))}else{
        req.user={name:get.name,email:get.email,_id:get._id};return next()}   }else{
    return next(new Error("User Doesn't Exist")) };


}catch(err){console.log(err);
;return next(new Error(err.message))}


};
const signIn=async(req,res)=>{console.log("inside sign");
    let access=generate_access({name:req.user.name,email:req.user.email,id:req.user._id});
    let refresh=generate_refresh({name:req.body.name,email:req.body.email,id:req.user._id});
   let session= await mongoose.startSession();

try{
    await session.startTransaction();
    await user_model.updateOne({_id:req.user._id},{$set:{token:refresh}},{session});await session.commitTransaction() }
    catch(err){
        next(err.message);await session.abortTransaction()}
        finally{await session.endSession()};


res.cookie("access",access,{maxAge:2 * 60 * 1000,httpOnly:true,secure:true,sameSite:"strict"});
res.cookie("refresh",refresh,{maxAge:24*60*60*1000,httpOnly:true,secure:true,sameSite:"strict"})
;return res.status(200).json("user signed in")}


module.exports={register,signIn,signIn_mw,generate_access,generate_refresh};
