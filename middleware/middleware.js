const mysessionmiddleare = async(req,res,next)=>{
    try{
        if(!req.session.user){
            if(req.query.name){
                req.session.user = req.query.name;
                res.redirect('http://localhost:4000/api')
            }else{
            res.status(401).json("You are not allowed to view the data unless you add your name! Paste this url and add your name:- http://localhost:4000/api?name='Your-Name'")
            }
        }else{
            next();
        }
    }catch(e){
        res.status(401).json(e);
    }
}
module.exports = mysessionmiddleare;