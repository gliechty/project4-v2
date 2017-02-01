var mongoose        = require('mongoose');
var User            = require('./model.js');

module.exports = function(app) {

    // gets users
    app.get('/users', function(req, res){
        var query = User.find({});
        query.exec(function(err, users){
            if(err)
                res.send(err);
            res.json(users);
        });
    });

    // saves users
    app.post('/users', function(req, res){
        var newuser = new User(req.body);

        // New User is saved in the db.
        newuser.save(function(err){
            if(err)
                res.send(err);
            res.json(req.body);
        });
    });

    // delete users

    app.delete('/users/:id', function(req, res){
        console.log("delete route hit");
        User.findById(req.params.id)
        .then(function(user){
            if(!user) return error(res, "no user with that id");
            return user.remove();
        })
        .then(function(){
            res.redirect("/");
        });
    });

};  