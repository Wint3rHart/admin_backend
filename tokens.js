const jwt = require("jsonwebtoken");
const { user_model } = require("./models");
const { ObjectId } = require("mongodb");
const { generate_refresh,generate_access } = require("./registration_controller");
let key='125xyz';

const login_mw=async (req,res,next)=>{console.log("in login process");
;let token=req.cookies.access; if(!token){return next(new Error ("access denied,login again"))};
try {
 
const verify=jwt.verify(token,key);
let get=await user_model.findOne({_id:new ObjectId(verify.id)});
if(!get){return next(new Error("User not found"))};
// console.log("success achieved");

req.user={name:verify.name,email:verify.email,id:verify.id};
return next();
} catch (error) {console.log(error.message);

   return next(new Error(error.message));
}

};
const login=(req,res)=>{console.log("in login fnx");
;return res.status(200).send({msg:"user logged in",detail:req.user})}


const make_access = async (req, res, next) => {
console.log("in new access");


    let token = req.cookies.refresh;

    
    if (token) {
        
        try {

            const check = jwt.verify(token, key);
            // console.log(check.id);
            
            let get = await user_model.findOne({ _id:new ObjectId(check.id) });
            if (!get) { return next(new Error("user not found")) };
            if (get.token === token) { req.user = { name: get.name, email: get.email, id: get._id };return next() } else {return next(new Error("invalid refresh token")) }
        } catch (error) {console.log(error.message);
        ;
            return next(error)
        }

    } else {return next(new Error("Please Login Again")) }
};

const new_access = async (req, res) => {
    
     let access_token = generate_access(req.user);
     let refresh_token=generate_refresh(req.user);
let put=await user_model.updateOne({_id:req.user.id},{$set:{token:refresh_token}});
console.log(put);

     res.cookie("access", access_token, { httpOnly: true, sameSite: "strict", secure: true, maxAge:2* 60 * 1000 }); 
     res.cookie("refresh",refresh_token,{httpOnly:true,secure:true,sameSite:"strict",maxAge:24*60*60*1000});

     return res.status(200).send({ msg: "new access granted" }) };
     

module.exports={login_mw,login,new_access,make_access}