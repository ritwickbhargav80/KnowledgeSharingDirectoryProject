const mongoose=require('mongoose');
const flash=require('connect-flash');
const axios = require('axios');

require('dotenv').config();

//import schemas
const Resource=require('../models/Resource');
const Blog = require('../models/Blog');

module.exports.index = (req, res) => {
    Resource.find().sort({date: 'desc'}).then(resource=>{
    	Blog.find().sort({date: 'desc'}).then(blog=>{
    		axios.get('https://contesttrackerapi.herokuapp.com').then(response => {
    			res.render('index/welcome', {
    				resources: resource, 
    				blogs: blog, 
    				ongoing: response.data.result.ongoing, 
    				upcoming: response.data.result.upcoming
    			});
    		});
    	});
    });
}

module.exports.about = (req,res)=>{
	res.render('index/about');
}

module.exports.contact = (req,res)=>{
	res.render('index/contact');
}

module.exports.sendmessage = (req, res)=>{
	let {name, email, subject, details}= req.body;
	Message.create({name: name, email: email, subject: subject, details: details}, (err, done)=>{
		if(err) throw err;
		else{
			req.flash('success_msg', 'Your message has been submitted successfully.');
		}
	})
}