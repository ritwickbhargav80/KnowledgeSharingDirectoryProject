const axios = require('axios');

require ('dotenv').config();

module.exports.ongoing = (req,res)=>{
	axios.get('https://contesttrackerapi.herokuapp.com').then(response => {
			res.render('contest/ongoing', {ongoing: response.data.result.ongoing});
	}).catch(error => { console.log(error) });
};

module.exports.upcoming = (req,res)=>{
	axios.get('https://contesttrackerapi.herokuapp.com').then(response => {
			res.render('contest/upcoming', {upcoming: response.data.result.upcoming});
	}).catch(error => { console.log(error) });
};