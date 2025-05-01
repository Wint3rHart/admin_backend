let mongoose=require("mongoose");
try{
mongoose.connect("mongodb+srv://hassan:mrhassan125@cluster0.is3nlcm.mongodb.net/Admin_panel?retryWrites=true&w=majority&appName=Cluster0").then(()=>{console.log("MONGODB connected")
}).catch((err)=>{console.log(err);
});
}catch(err){console.log(err);
}
module.exports=mongoose