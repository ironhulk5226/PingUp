export const protect = async(req,res,next) =>{
    try {
        const {userId} = req.auth();
        if(!userId){
            // Check if this is an SSE request
            if(req.headers.accept && req.headers.accept.includes('text/event-stream')){
                res.status(401).end();
                return;
            }
            return res.json({success:false , message:"Not Authenticated"})
        }
        next()

    } catch (error) {
        // Check if this is an SSE request
        if(req.headers.accept && req.headers.accept.includes('text/event-stream')){
            res.status(401).end();
            return;
        }
        res.json({success:false,message:error.message})
    }
}
