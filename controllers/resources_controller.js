const mongoose=require('mongoose');
const flash=require('connect-flash');
const axios = require('axios');

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
			    res.render('Resource/resource.ejs', {
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
				res.render('view.ejs', {resources: result, likes:likes, comments: comments});
			});
		});
	});
};

module.exports.searchtext = (req,res)=>{
	var query = req.body.query;
	if(query != ''){
		Resource.find({$text: {$search: query}}).then(result=>{
			res.render('dashboard', {resources: result});
		})
	}
}


module.exports.search = (req,res)=>{
    var category = req.body.category;
    var type = req.body.type;

    if(category!=undefined && type!=undefined){
        Resource.find({category: {$in: category}, type: {$in: type} }).sort({date: 'desc'}).then(result=>{
		res.render('Resource/resource.ejs', {resources: result});
	    });
    }
    else if(category!=undefined && type==undefined){
    	Resource.find({category: {$in: category}}).sort({date: 'desc'}).then(result=>{
		res.render('Resource/resource.ejs', {resources: result});
	    });
    }
    else if(category==undefined && type!=undefined){
    	Resource.find({type: {$in: type}}).sort({date: 'desc'}).then(result=>{
		res.render('Resource/resource.ejs', {resources: result});
	    });
    }
    else{
    	Resource.find().sort({date: 'desc'}).then(result=>{
		res.render('Resource/resource.ejs', {resources: result});
	    });
    }
};



module.exports.like = (req,res)=>{
	Like.create({user: req.user.id, for: req.params.id}, (err, done)=>{
		if(err) throw err;
		else{
			return done;
		}
	});
}

module.exports.comment = (req,res)=>{
	Comment.create({for: req.params.id, comment: req.body.comment, user: req.user.name}, (err, done)=>{
		if(err) throw err;
		else{
		    return done;
		}
	});	
}

module.exports.deletecomment = (req,res)=>{
	Comment.deleteOne({_id: req.params._id}, (err, done)=>{
		if(err) throw err;
		else{
			return done;
		}
	});
}


module.exports.add = (req, res)=>{
	Setting.find({for: 'resources'}).then(result=>{
		res.render('Resource/add.ejs', {settings: result});
	});
};

module.exports.addprocess = (req,res)=>{
    const {type,category,name,author,details}=req.body;
    if(!type || !category || !name || !author || !details){
    	req.flash('error_msg', 'All fields compulsary.');
    	res.redirect('/resources/add');
    }
    if(!req.file.url){	
		req.flash('error_msg', 'Please upload an image.');
    	res.redirect('/resources/add');    	
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
				res.redirect('/resources/add');
			}
			else{
				req.flash('success_msg', 'Resource added successfully.');
				res.redirect('/resources/add');
			}
		});
} 

module.exports.update = (req,res)=>{
	Resource.findOne({_id: req.params.id}).then(result=>{
		Setting.find({for: 'resources'}).then(setting=>{
			res.render('update', {resources: result, settings: setting});
		});
	});
}

module.exports.updateprocess = (req,res)=>{
	cloudinary.v2.api.delete_resources([req.params.img.id], (error, result)=>{
    	console.log(result);
    });
    Resource.findOne({_id: req.params.id}).then(result=>{
		result.type = req.body.type;
		result.category = req.body.category;
        result.name = req.body.name;
		result.author = req.body.author;
        result.details = req.body.details;
		img = {id: req.file.public_id, url: req.file.url},
		result.user = req.user.name;
		result.save().then(result => {
			req.flash('success_msg', 'Resource updated successfully.');
			res.redirect('/resources'); 
       });
	});
}

module.exports.delete = (req,res)=>{
    cloudinary.v2.api.delete_resources([req.params.img.id], (error, result)=>{
    	console.log(result);
    });
    Resource.deleteOne({_id: req.params.id}, (err, done) => {
        if(err){
				req.flash('error_msg', 'Something went wrong.');
				res.redirect('/resources');
		}
    	else{
				req.flash('success_msg', 'Resource deleted successfully.');
				res.redirect('/resources');
    	}
  	});
}
