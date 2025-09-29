const Session =require("../models/session");
const Question = require("../models/question");
 
exports.createSession = async (req, res) => {
    try {
        const { role, experience, description, topicsToFocus, questions } = req.body;
        
        // Validate required fields
        if (!role || !experience || !Array.isArray(questions)) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields or questions is not an array"
            });
        }

        const userId = req.user._id;
        
        // Create session
        const session = await Session.create({
            user: userId,
            role,
            experience,
            topicsToFocus,
            description
        });

        // Create questions if any exist
        let questionDocs = [];
        if (questions.length > 0) {
            questionDocs = await Promise.all(
                questions.map(async (q, index) => {
                    if (!q.question || !q.answer) {
                        throw new Error(`Question ${index + 1} is missing required fields`);
                    }
                    
                    const question = await Question.create({
                        session: session._id,
                        question: q.question,
                        answer: q.answer,
                    });
                    return question._id;
                })
            );
        }
        
        // Update session with question IDs
        session.questions = questionDocs;
        await session.save();

        res.status(201).json({ success: true, session });

    } catch (error) {
        console.error("Create session error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Server Error" 
        });
    }
};



exports.getMySession=async(req,res)=>{
    try{
        const sessions=await Session.find({user:req.user.id})
        .sort({createdAt:-1}).populate("questions");
        res.status(200).json(sessions);


    } catch(error)
    {
        console.error(">>> ERROR IN getMySession:", error);
        res.status(500).json({success:false,message:"Server Error"});
    }

};
exports.getSessionById=async(req,res)=>{
    try{
        const session=await Session.findById(req.params.id)
        .populate({
            path:"questions",
            options:{sort:{isPinned:-1,createdAt:1}}
        }).exec();
        if(!session){
                return res
                .status(404)
                .json({success:false,message:"message not fount"});

        }
        return res.status(200).json({success:true,session});
    } catch(error)
    {
        res.status(500).json({success:false,message:"Server Error"});
    }

};
exports.deleteSession=async(req,res)=>{
    try{
        const session=await Session.findById(req.params.id);
        if(!session){
                return res
                .status(404)
                .json({success:false,message:"message not fount"});
        }
        if(session.user.toString()!=req.user.id){
            return res.status(401).
            json({message:"Not authorized to delete the session"})
        }
        await Question.deleteMany({session:session._id});
        await session.deleteOne();
        res.status(200).json({success:true,message:"message deleteed successfull"});

         
    } catch(error)
    {
        res.status(500).json({success:false,message:"Server Error"});
    }

};


