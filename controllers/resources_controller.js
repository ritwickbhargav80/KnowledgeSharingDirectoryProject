const mongoose=require('mongoose');
const flash=require('connect-flash');
const axios = require('axios');
const cloudinary = require('cloudinary');
require('dotenv').config();

//image upload functionality
const imgupload=require('../config/imgupload');

//import schemas
const Resource=require('../models/Resource');
const Like=require('../models/Like');
const Comment = require('../models/Comment');
const Setting = require('../models/Setting');


module.exports.index = (req,res)=>{
	Resource.find().sort({date: 'desc'}).then(result=>{
		Setting.find({for: 'resources'}).then(settings=>{
			axios.get('https://contesttrackerapi.herokuapp.com').then(response => {
			    res.json({
			    	resources: result, 
			    	settings: settings,
			    	ongoing: response.data.result.ongoing, 
    				upcoming: response.data.result.upcoming
			    });
			});
		});
	});
};

module.exports.view = (req, res)=>{
	Resource.findOne({_id: req.params.id}).then(result=>{
		Like.find({for: req.params.id}).then(likes=>{
			Comment.find({for:req.params.id}).sort({date: 'desc'}).then(comments=>{
				res.json({resources: result, likes:likes, comments: comments});
			});
		});
	});
};

module.exports.search = (req,res)=>{
    var category = req.body.category;
    var type = req.body.type;

    if(category!=undefined && type!=undefined){
        Resource.find({category: {$in: category}, type: {$in: type} }).sort({date: 'desc'}).then(result=>{
		res.json({resources: result});
	    });
    }
    else if(category!=undefined && type==undefined){
    	Resource.find({category: {$in: category}}).sort({date: 'desc'}).then(result=>{
		res.json({resources: result});
	    });
    }
    else if(category==undefined && type!=undefined){
    	Resource.find({type: {$in: type}}).sort({date: 'desc'}).then(result=>{
		res.json({resources: result});
	    });
    }
    else{
    	Resource.find().sort({date: 'desc'}).then(result=>{
		res.json({resources: result});
	    });
    }
};



module.exports.like = (req,res)=>{
	Like.create({user: req.user.id, for: req.params.id}, (err, done)=>{
		if(err) throw err;
		else{
			req.flash('success_msg', 'liked!!');
			res.redirect('back');
		}
	});
}

module.exports.comment = (req,res)=>{
	Comment.create({for: req.params.id, comment: req.body.comment, user: req.user.name}, (err, done)=>{
		if(err) throw err;
		else{
		    req.flash('success_msg', 'commented!');
		    res.redirect('back');
		}
	});	
}

module.exports.add = (req, res)=>{
	Setting.find({for: 'resources'}).then(result=>{
		res.json({settings: result});
	});
};

module.exports.addprocess = (req,res)=>{
    const {type,category,name,author,details}=req.body;
    if(!type || !category || !name || !author || !details){
    	req.flash('error_msg', 'All fields compulsary.');
    	res.redirect('back');
    }
    if(!req.file.url){	
		req.flash('error_msg', 'Please upload an image.');
    	res.redirect('back');    	
    }
    Resource.create({
		type: req.body.type,
		category: req.body.category,
		name: req.body.name,
		author: req.body.author,
		details: req.body.details,
		img: {id: req.file.public_id, url: req.file.url},
		user: req.user.name
	    }, (err, done) => {
			if(err){
				req.flash('error_msg', 'Something went wrong.');
				res.redirect('back');
			}
			else{
				req.flash('success_msg', 'Resource added successfully.');
				res.redirect('back');
			}
		});
} 

module.exports.update = (req,res)=>{
	Resource.findOne({_id: req.params.id}).then(result=>{
		Setting.find({for: 'resources'}).then(setting=>{
			res.json({resources: result, settings: setting});
		});
	});
}

module.exports.updateprocess = (req,res)=>{
    Resource.findOne({_id: req.params.id}).then(result=>{
    	cloudinary.v2.api.delete_resources([result.img.id], (error, done)=>{
    	console.log(done);
    });	
    	result.type = req.body.type;
		result.category = req.body.category;
        result.name = req.body.name;
		result.author = req.body.author;
        result.details = req.body.details;
		result.img = {id: req.file.public_id, url: req.file.url},
		result.user = req.user.name;
		result.save().then(result => {
			req.flash('success_msg', 'Resource updated successfully.');
			res.redirect('back'); 
       });
	});
}

module.exports.delete = (req,res)=>{
	Resource.findOne({_id: req.params.id}).then(result=>{
	    cloudinary.v2.api.delete_resources([result.img.id], (error, done)=>{
    	console.log(done);
    });	
	})
    Resource.deleteOne({_id: req.params.id}, (err, done) => {
        if(err){
				req.flash('error_msg', 'Something went wrong.');
				res.redirect('back');
		}
    	else{
				req.flash('success_msg', 'Resource deleted successfully.');
				res.redirect('back');
    	}
  	});
}


module.exports.all = (req,res)=>{
	Resource.find().then(resource=>{
		res.json(resource);
	})
}