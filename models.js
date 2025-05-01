
let mongoose=require("./App");
let bcrypt=require("bcrypt");

let user_schema=new mongoose.Schema ({name:{type:String,required:true},email:{type:String,required:true},password:{type:String,required:true},profilePic:{type:String,required:true},token:{type:String,default:null}},{timestamps:true});

try{
user_schema.pre("save",async function(next){

if(this.isModified("password")){this.password=await bcrypt.hash(this.password,10)};
const db_check=await this.constructor.findOne({name:this.name});
if(db_check){
if(db_check._id!=this._id){return next(new Error("name must be unique")); }
};
next()

})
}catch(err){next(err)};

let user_model=new mongoose.model("admin_users",user_schema,"admins");




module.exports={user_model};