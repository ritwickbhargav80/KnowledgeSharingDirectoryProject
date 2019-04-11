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
			axios.get('https://contesttrackerapi.herokuapp.com').then(response => {
			    res.render('Blog/index.ejs', {
			    	blogs: result, 
			    	settings: settings,
			    	ongoing: response.data.result.ongoing, 
    				upcoming: response.data.result.upcoming
			    });
			});
		});
	});
};

module.exports.view = (req, res)=>{
	Blog.findOne({_id: req.params.id}).then(result=>{
		Like.find({for: req.params.id}).then(likes=>{
			Comment.find({for:req.params.id}).sort({date: 'desc'}).then(comments=>{
				res.render('Blog/view.ejs', {blogs: result, likes:likes, comments: comments});
			});
		});
	});
};

module.exports.search = (req,res)=>{
    var category = req.body.category;

    if(category!=undefined){
        Blog.find({category: {$in: category}}).sort({date: 'desc'}).then(result=>{
		res.render('Blog/index.ejs', {blogs: result});
	    });
    }
    else{
    	Blog.find().sort({date: 'desc'}).then(result=>{
		res.render('Blog/index.ejs', {blogs: result});
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
	Setting.find({for: 'blogs'}).then(result=>{
		res.render('Blog/add.ejs', {settings: result});
	});
};

module.exports.addprocess = (req,res)=>{
    const {type,category,name,author,details}=req.body;
    if(!category || !title  || !details){
    	req.flash('error_msg', 'All fields compulsary.');
    	res.redirect('back');
    }
    if(!req.file.url){	
		req.flash('error_msg', 'Please upload an image.');
    	res.redirect('back');    	
    }
    Blog.create({
		category: req.body.category,
		title: req.body.title,
		details: req.body.details,
		img: {id: req.file.public_id, url: req.file.url},
		user: req.user.name
	    }, (err, done) => {
			if(err){
				req.flash('error_msg', 'Something went wrong.');
				res.redirect('back');
			}
			else{
				req.flash('success_msg', 'Blog added successfully.');
				res.redirect('back');
			}
		});
} 

module.exports.update = (req,res)=>{
	Blog.findOne({_id: req.params.id}).then(result=>{
		Setting.find({for: 'blogs'}).then(setting=>{
			res.render('Blog/update', {blogs: result, settings: setting});
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
			req.flash('success_msg', 'Blog updated successfully.');
			res.redirect('back'); 
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
				req.flash('error_msg', 'Something went wrong.');
				res.redirect('back');
		}
    	else{
				req.flash('success_msg', 'Blog deleted successfully.');
				res.redirect('back');
    	}
  	});
}


module.exports.all = (req,res)=>{
	Blog.find().then(blog=>{
		res.json(blog);
	})
}