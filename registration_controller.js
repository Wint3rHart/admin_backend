
let {user_model}=require("./models")
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

const signIn=async(req,res)=>{

try{
    
    const get=await user_model.findOne({name:req.body.name});
    if(get){ if(get.email!=req.body.email){return  next(new Error("invalid email")) }   }else{};
    // need to implement bcrypt comparison in if elsefor password and do no user found in else

}catch(err){}


}


module.exports={register}