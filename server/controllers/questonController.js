const Question=require("../models/question");
const Session=require("../models/session");

exports.addQuestionToSession=async (req,res)=>{
    try {
        const {sessionId,questions}=req.body;
        if(!sessionId || !questions || !Array.isArray(questions))
        {
            return res.status(400).json({meassage:"Invalid input data"});
        }
        const session=await Session.findById(sessionId);
        if(!session)
        {
            return res.status(404).json({meassage:"Session not fount"});   
        }

        const createdQuestions=await Question.insertMany(
            questions.map((q)=>({
            session:sessionId,
            question:q.question,
            answer:q.answer,
            })
        ));

        session.questions.push(...createdQuestions.map((q)=>q._id));
        await session.save();
        res.status(201).json(createdQuestions);
        
        
    } catch (error) {
        console.error(error); //
        res.status(500).json({meassage:"Server Error"});

    }
}

exports.togglePinQuestion=async (req,res)=>{
    try {
        const question = await Question.findById(req.params.id);
        if(!question)
        {
            return res.status(404).json({success:false,meassage:"Qestion not fount"});
        }
        question.isPinned=!question.isPinned;
        await question.save();
        res.status(201).json({success:true,question});
    } catch (error) {
         console.error(error);
        res.status(500).json({meassage:"Server Error"});

    }
}

exports.updateQuestionNote=async (req,res)=>{
    try {
        const {note}=req.body;
        const question = await Question.findById(req.params.id);
        if(!question)
        {
            return res.status(404).json({success:false,meassage:"Qestion not fount"});
        }

        question.note=note||"";
        await question.save();
        res.status(200).json({success:true,question});

    } catch (error) {
        res.status(500).json({meassage:"Server Error"});

    }
}   