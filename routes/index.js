var express = require("express");
var router = express.Router();
var Student = require("../model/Student");
var Post = require("../model/Post");
var mongodb = require('../model/db');
var crypto = require('crypto');
var multer = require('multer');

module.exports = function (app) {
    //首页
    app.get('/',function (req,res) {
        //展示信息
        Post.getAll(null,function(err,docs){
            if(err){
                req.flash("error",err);
                return res.redirect("/");
            }
            res.render("index",{
                title:"学生信息管理",
                docs:docs,
                success:req.flash("success").toString(),
                error:req.flash("error").toString()
            })
        })
    })

    //添加学生页面
    app.get('/add',function (req,res) {
        res.render('add',{
          title:'添加学生信息页面',
            success : req.flash('success').toString(),
            error : req.flash('error').toString()
        })
    });
    //添加行为
    app.post("/add",function(req,res){
        var name = req.body.name;
        var age = req.body.age;
        var gender = req.body.gender;
        var phone = req.body.phone;
        var email = req.body.email;
        var detail = req.body.detail;

        // 存入数据库
        var student = new Student({
            name:name,
            age:age,
            gender:gender,
            phone:phone,
            email:email,
            detail:detail
        });
        student.save(function(err,name){
            if (err) {
                req.flash('error',err);
                return res.redirect("/add");
            }else{
                req.session.name = student;
                req.flash('success','添加成功');
               return res.redirect('/');
            }
        });
    });
    //编辑
    app.get('/edit/:name/:age/:gender/:phone/:email/:detail',function (req,res) {
        Post.edit(req.params.name,req.params.age,req.params.gender,req.params.phone,req.params.email,req.params.detail,function (err,doc) {
            if(err){
                req.flash('error',err);
                return res.redirect('/')
            }
            return res.render('edit',{
                title:'编辑学生信息',
                success:req.flash('success').toString(),
                error:req.flash('error').toString(),
                doc:doc
            })
        })
    })
    //编辑行为
    app.post('/edit',function (req,res) {
        Post.update(req.body.name,req.body.age,req.body.gender,req.body.phone,req.body.email,req.body.detail,function (err,doc) {
            if(err){
                req.flash('error',err);
                return res.redirect('/')
            }
            req.flash('success','修改成功');
            return res.redirect('/');
        })
    })
    //删除
    app.get('/remove/:name/:age/:gender/:phone/:email/:detail',function (req,res) {
        Post.remove(req.params.name,req.params.age,req.params.gender,req.params.phone,req.params.email,req.params.detail,function (err) {
            if(err){
                req.flash('error',err);
                return res.redirect('/')
            }
            req.flash('success','删除成功');
            return res.redirect('/');
        })
    })
    //搜索
    app.get('/search',function(req,res){
        Post.search(req.query.keyword,function(err,docs){
            if(err){
                req.flash('error',err);
                return res.redirect('/');
            }
            return res.render('search',{
                title:'搜索学生信息页面',
                success:req.flash('success').toString(),
                error:req.flash('error').toString(),
                docs:docs
            })
        })
    })
}
