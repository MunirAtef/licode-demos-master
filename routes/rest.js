const rooms = require('./../models/roomModel');
const tokens = require('./../models/tokenModel');
const service = require('../config').service;

exports.createToken = function(req, res){
	const roomId = req.body.roomId;
	const username = req.body.username;
	const role = req.body.role;
	tokens.create(roomId, username, role, {id: service.id, key: service.key}, function(token){

		console.log('eieieiie', token);
		res.send(token);
	}, function(e) {	
		console.log('nonon ', e);
		res.send(e);
	});
};

exports.createRoom = function(req, res) {
	let p2p = false;
	if (req.body.p2p) {
		p2p = true;
	}
	let data = {type: req.body.type};
	data.public = !!req.body.public;
	rooms.create(req.body.name, data, p2p, {id: req.session.id, key: req.session.key}, function(){

		console.log('deleted');
		res.redirect('/admin');

	}, function() {
		req.session = null;
		res.redirect('/admin/login');
	});
};

exports.deleteRoom = function(req, res) {

	rooms.delete(req.params.room, {id: req.session.id, key: req.session.key}, function(){

		console.log('deleted');
		res.redirect('/admin');

	}, function() {
		req.session = null;
		res.redirect('/admin/login');
	});
	
};