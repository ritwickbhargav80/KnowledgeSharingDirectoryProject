const mongoose=require('mongoose');
const flash=require('connect-flash');
const axios = require('axios');
const cloudinary = require('cloudinary');
require('dotenv').config();

//image upload functionality
const imgupload=require('../config/imgupload');

//import schemas
const Blog=require('../models/Blog');
const Like=require('../models/Like');
const Comment = require('../models/Comment');
const Setting = require('../models/Setting');


module.exports.index = (req,res)=>{
	Blog.find().sort({date: 'desc'}).then(result=>{
		Setting.find({for: 'blogs'}).then(settings=>{
			    res.json({
			    	blogs: result, 
			    	settings: settings,
			    });
		});
	});
};

module.exports.view = (req, res)=>{
	Blog.findOne({_id: req.params.id}).then(result=>{
		Like.find({for: req.params.id}).then(likes=>{
			Comment.find({for:req.params.id}).sort({date: 'desc'}).then(comments=>{
				res.json({blogs: result, likes:likes, comments: comments});
			});
		});
	});
};

module.exports.search = (req,res)=>{
    var category = req.body.category;

    if(category!=undefined){
        Blog.find({category: {$in: category}}).sort({date: 'desc'}).then(result=>{
		res.json({blogs: result});
	    });
    }
    else{
    	Blog.find().sort({date: 'desc'}).then(result=>{
		res.json({blogs: result});
	    });
    }
};



module.exports.like = (req,res)=>{
	Like.create({user: req.user.id, for: req.params.id}, (err, done)=>{
		if(err) throw err;
		else{
			req.json({message: 'liked!!'});
		}
	});
}

module.exports.comment = (req,res)=>{
	Comment.create({for: req.params.id, comment: req.body.comment, user: req.user.name}, (err, done)=>{
		if(err) throw err;
		else{
		    req.json({message: 'commented!'});
		
		}
	});	
}

module.exports.add = (req, res)=>{
	Setting.find({for: 'blogs'}).then(result=>{
		res.json({settings: result});
	});
};

module.exports.addprocess = (req,res)=>{
    const {type,category,name,author,details}=req.body;
    if(!category || !title  || !details){
    	req.json({message: 'All fields compulsary.'});
 
    }
    if(!req.file.url){	
		req.json({message: 'Please upload an image.'});
     	
    }
    Blog.create({
		category: req.body.category,
		title: req.body.title,
		details: req.body.details,
		img: {id: req.file.public_id, url: req.file.url},
		user: req.user.name
	    }, (err, done) => {
			if(err){
				req.json({message: 'Something went wrong.'});

			}
			else{
				req.json({message: 'Blog added successfully.'});

			}
		});
} 

module.exports.update = (req,res)=>{
	Blog.findOne({_id: req.params.id}).then(result=>{
		Setting.find({for: 'blogs'}).then(setting=>{
			res.json({blogs: result, settings: setting});
		});
	});
}

module.exports.updateprocess = (req,res)=>{
    Blog.findOne({_id: req.params.id}).then(result=>{
    	cloudinary.v2.api.delete_resources([result.img.id], (error, done)=>{
    	console.log(done);
    });	
		result.category = req.body.category;
        result.title = req.body.title;
        result.details = req.body.details;
		result.img = {id: req.file.public_id, url: req.file.url},
		result.user = req.user.name;
		result.save().then(result => {
			req.json({message: 'Blog updated successfully.'}); 
       });
	});
}

module.exports.delete = (req,res)=>{
	Blog.findOne({_id: req.params.id}).then(result=>{
	    cloudinary.v2.api.delete_resources([result.img.id], (error, done)=>{
    	console.log(done);
    });	
	})
    Blog.deleteOne({_id: req.params.id}, (err, done) => {
        if(err){
				req.json({message: 'Something went wrong.'});

		}
    	else{
				req.json({message: 'Blog deleted successfully.'});

    	}
  	});
}

module.exports.all = (req,res)=>{
	Blog.find().then(blog=>{
		res.json(blog);
	})
}