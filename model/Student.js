var mongodb = require('./db');

function Student(student) {
    this.name = student.name;
    this.age = student.age;
    this.gender = student.gender;
    this.phone = student.phone;
    this.email = student.email;
    this.detail = student.detail;
}

module.exports = Student;

Student.prototype.save = function (callback) {
    var student = {
        name:this.name,
        age:this.age,
        gender:this.gender,
        phone:this.phone,
        email:this.email,
        detail:this.detail

    }
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('student',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.insert(student,{safe:true},function (err,student) {
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,student[0]);
            })
        })
    })
}

Student.get = function (name,callback) {
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('student',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.findOne({name:name},function (err,student) {
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null,student);
            })
        })
    })
}
