const { request } = require("express");
const express = require("express");
const app = express();
const port = 3000;
const request1 = require('request')

const {initializeApp , cert} = require('firebase-admin/app');
const {getFirestore} = require('firebase-admin/firestore');

var serviceAccount = require("./Key.json");   
                   

initializeApp({
    credential: cert(serviceAccount)
})
const db = getFirestore(); 

app.set('view engine','ejs');


app.get("/",(req,res)=>{
    res.render('home')
});

app.get("/selecttype",(req,res)=>{
    res.render('selecttype')
 });

 app.get("/idsubmit",function(req,res){
    const adid = req.query.adid;
    request1('https://type.fit/api/quotes'+adid+'',function(error,response,body){
        const adviceobj=JSON.parse(body).slip;
        const advice = adviceobj.advice;
        console.log(advice)
        res.render('advice',{advice:advice})
    })
 });
 
 app.get("/randomsubmit",function(req,res){
    const adid = req.query.adid;
    request1('https://type.fit/api/quotes',function(error,response,body){
        const adviceobj=JSON.parse(body).slip;
        const advice = adviceobj.advice;
        console.log(advice)
        res.render('advice',{advice:advice})
    })
 });

 app.get("/signin",(req,res)=>{
    res.render('signin')
 });

 app.get("/signinsubmit",(req,res)=>{
    const email = req.query.email;
    const password = req.query.pwd;

    db.collection('users')
    .where("email","==",email)
    .where("password","==",password)
    .get()
    .then((docs) =>{
        if(docs.size >0){
            res.render("selecttype")
        }
        else{
            res.render('signup')
        }
    })

 });


 app.get("/signup",(req,res)=>{
     res.render('signup')
 });

 app.get("/signupsubmit",(req,res)=>{
    
    const firstname = req.query.fname;
    const lastname = req.query.lname;
    const email = req.query.email;
    const phone = req.query.phone;
    const password = req.query.pwd;

db.collection('users').add({
    name : firstname + " "+lastname,
    email : email,
    password : password,
}).then(() =>{
    res.send("registration successful")
})

});

app.listen(port ,() =>{
    console.log("example app running $(port)")
});