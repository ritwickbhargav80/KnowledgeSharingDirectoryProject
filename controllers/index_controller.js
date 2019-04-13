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
    			res.json({
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
	res.json({message: '404'});
}

module.exports.contact = (req,res)=>{
	res.json({message: '404'});
}

module.exports.sendmessage = (req, res)=>{
	let {name, email, phone, message} = req.body;
	Message.create(req.body, (err, done)=>{
		if(err) throw err;
		else{
			req.json({message: 'Your message has been submitted successfully.'});
            //res.redirect('back');
		}
	})
}

module.exports.allmessage = (req,res)=>{
    Message.find().sort({date: 'desc'}).then(messages=>{
        res.json(messages);
    })
}