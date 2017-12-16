/**
 * Created by Administrator on 2017/12/14.
 */
/**
 * Created by Administrator on 2017/12/12.
 */
var mongodb = require('./db');
function Post(name,age,gender,phone,email,detail) {
    this.name = name;
    this.age = age;
    this.gender = gender;
    this.phone = phone;
    this.email = email;
    this.detail = detail;
}
Post.prototype.save = function (callback) {
    var newContent = {
        name:this.name,
        age:this.age,
        gender:this.gender,
        phone:this.phone,
        email:this.email,
        detail:this.detail,

    }
    //3.打开数据库
    //4.读取post集合
    //5.将数据插入到集合中  并跳转到首页
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('student',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.insert(newContent,function (err,doc) {
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null,doc);
            })
        })
    })
}
Post.getAll= function(name,page,callback){
    // 打开数据库
    mongodb.open(function(err,db) {
        if (err) {
            return callback(err);
        }
        db.collection("student", function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {}
            if (name) {
                query.name = name;
            }
            collection.count(query, function (err, total) {
                if (err) {
                    mongodb.close();
                    return callback(err);
                }
                collection.find(query, {
                    skip: (page - 1) * 5,
                    limit: 5
                }).toArray(function (err, docs) {
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    return callback(null, docs,total);
                })
            })
        })
    })
}
//编辑
Post.edit = function (name,age,callback) {
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('student',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.findOne({
                name:name,
                age:age
            },function (err,doc) {
                mongodb.close();
                if(err){
                    return callback(err);
                }
                // console.log(doc)
                return callback(null,doc);
            })
        })
    })
}
Post.update = function (name,age,gender,phone,email,detail,callback) {
    mongodb.open(function (err,db) {
        if(err){
            return callback(err)
        }
        db.collection('student',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.update({
                name:name
            },{
                $set:{
                    age:age,
                    gender:gender,
                    phone:phone,
                    email:email,
                    detail:detail
                }
            },function (err,doc) {
                mongodb.close();
                if(err){
                    return callback(err);
                }
                // console.log(doc);
                return callback(null,doc);
            })
        })
    })
}
//删除
Post.remove = function (name,age,gender,phone,email,detail,callback) {
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('student',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.remove({
                name:name,
                age:age,
                gender:gender,
                phone:phone,
                email:email,
                detail:detail
            },{
                w:1
            },function (err) {
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null);
            })
        })
    })
}
//搜索
Post.search = function(keyword,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('student',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var newRegex = new RegExp(keyword,"i");
            collection.find({
                name:newRegex
            }).toArray(function(err,docs){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null,docs);
            })

        })
    })
}
module.exports = Post;

