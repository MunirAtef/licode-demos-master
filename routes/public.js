const rooms = require('./../models/roomModel');
const ejs = require('ejs');
const fs = require('fs');
const service = require('../config').service;
const host = require('../config').demo_host;
const plain = require('../config').plain;

exports.index = (req, res) => {

  rooms.fetch({id: service.id, key: service.key}, function () {
    const publicRooms = [];

    for (const r in rooms.roomList) {
      if (rooms.roomList[r].data.public) {
        const demo = rooms.roomList[r].data.type;
        let desc = '';
        try {
          desc = fs.readFileSync('public/demos/' + demo + '/' + demo + '.txt');
        } catch (e) {
          desc = 'Demo room';
        }
        rooms.roomList[r].description = desc;
        publicRooms.push(rooms.roomList[r]);
      }
    }
    let title = 'Licode';
    if (plain) {
      title = 'Demo';
    }
    res.render('index', {title: title, rooms: publicRooms, host: host, plain: plain});

  }, function () {

  });
};

exports.room = (req, res) => {
  console.log(req)
  if (req.query.id) {
    console.log(req.query);
    console.log(req.query.id);
    rooms.get(req.query.id, {id: service.id, key: service.key}, function (room) {

      const demo = room.data.type;
      // const demo = "audioconference";
      ejs.renderFile('public/demos/' + demo + '/' + demo + '.html', function (err, body) {
        if (err) {
          body = '';
        }
        let title = 'Li-code';
        if (plain) {
          title = 'Demo';
        }
        res.render('demo', {demo: demo, body: body, title: title, plain: plain});
      });
    }, function () {
      res.redirect('/');
    });

  } else {
    res.redirect('/');
  }
};

exports.spy_room = (req, res) => {
  console.log(req.query.id);
  if (req.query.id) {
    rooms.get(req.query.id, {id: service.id, key: service.key}, function (room) {
      res.render('spy', {title: 'Licode', demo: 'spy'});
      console.log(room)
    }, function () {
      res.redirect('/');
    });

  } else {
    res.redirect('/');
  }
};

exports.room_type = (req, res) => {
  if (req.query.id) {
    rooms.get(req.query.id, {id: service.id, key: service.key}, function (room) {
      res.send(room.data.type);
    }, function () {
      res.send(404);
    });

  } else {
    res.send(404);
  }
};