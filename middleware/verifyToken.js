const jwt=require("jsonwebtoken")
let verifyToken=(req,res,next)=>{
    //console.log("req obj is",req);
    let tokenWithBearer=req.headers["authorization"];
    if(tokenWithBearer==undefined){
        res.send({message:"Please login to continue"})
    }
    else{
        let token=tokenWithBearer.slice(7,tokenWithBearer.length);
        //verify the token
        jwt.verify(token,"ssshhh",(err,decodedToken)=>{
            if(err){
                res.send({message:"pls relogin to continue..."})
            }
            else{
                //forwarding req
                next();
            }
        })
    }
}
//export
module.exports=verifyToken