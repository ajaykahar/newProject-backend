const express=require('express');
const app=express();
const mongoose=require('mongoose')
const config=require('./config')

const bodyParser=require('body-parser')

 const CORS=require('cors')

app.use(
    bodyParser.urlencoded({
      extended: false,
    })
  );
  app.use(bodyParser.json());
  app.use(CORS())
  
app.use('/route',require('./controllers/userController'))

mongoose.connect(config.DB_URI,{ useNewUrlParser: true , useUnifiedTopology: true });
mongoose.connection.on('error',function(err){
    console.log("Database connection Error");
    console.log(err);
})
mongoose.connection.on('open',function(){
        console.log("Database connection open success");
})

app.listen(5000,function(){
    console.log("App is listening on port 5000")
})
