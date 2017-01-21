/**
 * Created by jaran on 7/19/2016.
 */

// var User = require('../app/models/user');
var Clas = require('../app/models/clas');
var Faq = require('../app/models/faq');
var Healer = require('../app/models/healer');
var Category = require('../app/models/category');
var Plan = require('../app/models/plan');

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/login');
}

module.exports = function(app, passport) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', isLoggedIn, function(req, res) {
        res.render('home.ejs', {
            user : req.user
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // LOGIN ===============================
    // show the login form
    app.get('/login', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // SIGNUP =================================
    // show the signup form
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // classList all
    app.get('/classList', isLoggedIn, function(req, res, next) {
        Clas.getClasesAll(function(err, clases) {
            if(err)
                next(err);
            else {
                Category.find({}, function(err2, categories) {
                    if(err2)
                        next(err2);
                    else {
                        res.render('classList.ejs', {
                            user : req.user,
                            clases: clases,
                            categories: categories,
                            categoryTitle: "All Classes"
                        });
                    }
                });
            }
        });
    });

    // classList by category
    app.get('/classList/:categoryId/:categoryName', isLoggedIn, function(req, res, next) {
        Clas.getClasesByCategoryId(req.params.categoryId, function(err, clases) {
            if(err)
                next(err);
            else {
                Category.find({}, function(err2, categories) {
                    if(err2)
                        next(err2);
                    else {
                        res.render('classList.ejs', {
                            user : req.user,
                            clases: clases,
                            categories: categories,
                            categoryTitle: req.params.categoryName
                        });
                    }
                });
            }
        });
    });

    // healerList
    app.get('/healerList', isLoggedIn, function(req, res, next) {
        Healer.find({}, function(err, healers) {
            if(err) {
                next(err);
            }
            else {
                Category.find({}, function(err2, categories) {
                    if(err2)
                        next(err2);
                    else {
                        res.render('healerList.ejs', {
                            user : req.user,
                            healers : healers,
                            categories: categories
                        });
                    }
                });
            }
        });
    });

    // faq
    app.get('/faq', isLoggedIn, function(req, res, next) {
        Faq.find({}, function(err, faqs) {
            if(err) {
                next(err);
            }
            else {
                Category.find({}, function(err2, categories) {
                    if(err2)
                        next(err2);
                    else {
                        res.render('faq.ejs', {
                            user : req.user,
                            faqs: faqs,
                            categories: categories
                        });
                    }
                });
            }
        });
    });

    // createPlan
    app.get('/createPlan', isLoggedIn, function(req, res, next) {
        Plan.find({}, function(err, plans) {
            if(err) {
                next(err);
            }
            else {
                res.render('createPlan.ejs', {
                    user : req.user,
                    plans: plans
                });
            }
        });
    });

    // classDetail
    app.get('/classDetail/:clasId/:title', isLoggedIn, function(req, res, next) {
        Clas.getClasById(req.params.clasId, function(err, clas) {
            if(err)
                next(err)
            else {
                Category.find({}, function(err2, categories) {
                    if(err2)
                        next(err2);
                    else {
                        res.render('classDetail.ejs', {
                            user : req.user,
                            clas : clas,
                            categories: categories
                        });
                    }
                });
            }
        });
    });

    // recommend
    app.get('/recommend/:planId', isLoggedIn, function(req, res, next) {
        Clas.getClasesByPlanId(req.params.planId, function(err, recommends) {
            if(err)
                next(err);
            else {
                res.render('recommend.ejs', {
                    user : req.user,
                    recommends: recommends
                });
            }
        });
    });
};
