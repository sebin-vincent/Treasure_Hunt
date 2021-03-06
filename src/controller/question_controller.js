const Question=require('../model/question');
const LeaderBoard = require('../model/leaderboard');
const User=require('../model/user');
const Contest=require('../model/contest');
const mongoose=require('mongoose');
const Joi = require('joi');
Joi.objectId= require('joi-objectid')(Joi);
const logger=require('winston');

exports.getCurrentQuestion=async (req,resp)=>{
    const userId=req.user.id;

    logger.info(`Request to get current question from userId: ${userId}`);

    const contestId=req.query.contestId;

    if(! mongoose.isValidObjectId(contestId)) throw({httpStatus:400,message:"Invalid contestId"});

    let contest=await Contest.findById(contestId);

    if(! contest) throw({httpStatus:404,message:"Contest doesn't exist"});

    if(! (contest.active && contest.started)) throw({httpStatus:400,message:"Contest not active yet"});
    
    let leaderboard=await LeaderBoard.findOne({userId,contestId});

    if(! leaderboard){
        logger.info(`Adding user to contest userId: ${userId}`);
        leaderboard=await addUserToContest(userId,contestId);
    }
    let question=await Question.findOne({contestId,level:leaderboard.level});

    if(question){
        logger.info(`Serving question with questionId: ${question.level} to userId: ${userId}`);
        let activeClues=[];
        activeClues=question.clues.filter(clue=> clue.number<=question.currentClue);

        let questionResponse={
            contestId,
            questionId:question._id,
            question:question.questionBody,
            imageUrl:question.image,
            clues:activeClues,
            level:question.level,
            timeCompleted:leaderboard.lastUpdated,
            lastQuestion:false
        }

        resp.status(200).json(questionResponse);
    }else{
        logger.info(`Request for final question by userId ${userId}`);
        resp.status(200).json({
            contestId,
            questionId:null,
            question:null,
            imageUrl:null,
            clues:null,
            level:leaderboard.level,
            timeCompleted:leaderboard.lastUpdated,
            lastQuestion:true});
    }
    
}

exports.submitQuestionAnswer= async (req,resp)=>{
    let requestBody;

    let requestSchema=Joi.object({
        contestId: Joi.objectId().required(),
        answer:Joi.string().required()
    });
    
    try{
        requestBody=await requestSchema.validateAsync(req.body);
    }catch(ex){
        throw ({httpStatus:400,message:ex.details[0].message})
    }

    const userId=req.user.id;

    logger.info(`Request to submit answer from userId ${userId}`)

    let contest=await Contest.findById(requestBody.contestId);
    if(! contest) throw({httpStatus:404,message:"Contest doesn't exist"});

    let leaderboard=await LeaderBoard.findOne({userId,contestId:requestBody.contestId});
    if(!leaderboard) throw({httpStatus:400,message:"User haven't registred with contest yet"});

    let question=await Question.findOne({level:leaderboard.level,enabled:true});
    if(!question) throw({httpStatus:400,message:"Bad request"});

    const submitedAnswer=requestBody.answer;
    if(submitedAnswer===question.answer){
        logger.info(`Correct answer: ${submitedAnswer} submission for level ${question.level} by from userId: ${userId}`);
        await updateUserLevel(leaderboard);
        resp.status(200).send(true);
    }else{
        logger.info(`Wrong answer: ${submitedAnswer} submission for level ${question.level} by from userId: ${userId}`);
        resp.status(200).send(false);
    }

}

async function updateUserLevel(leaderboard) {

    let level=leaderboard.level+1;
    leaderboard.level=level;
    leaderboard.lastUpdated=new Date();
    await leaderboard.save();
}


async function  addUserToContest (userId,contestId){

    let user=await User.findById(userId);

    let leaderboard=new LeaderBoard({
        contestId,
        userId,
        userName:user.name,
        level:1,
        lastUpdated:new Date()
    });
    leaderboard=await leaderboard.save();

    return leaderboard;
}