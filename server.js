const expres=require('express')
const mysql=require('mysql2')
const bodyparse=require('body-parser')
const cors=require('cors')

require('dotenv').config();

const app=expres()
const port= process.env.DB_PORT || 3306;

// Middleware
app.use(cors())
app.use(bodyparse.json())
// MySQL Connect
const db=mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME
})
db.connect((err)=>{
    if(err) throw err;
    console.log('DB is Connected...');
})
//APIs
//Create table

app.get("/createtable",(req,res)=>{
    let sql='create table post(id int auto_increment,name varchar(200) not null , content text , primary key(id))';
    db.query(sql,(err,result)=>{
        if(err) throw err;
        res.send('Post table created...');
    })
})
//Insert data
app.post("/addpost",(req,res)=>{
    let post={name:req.body.name,content:req.body.content};
    let sql='insert into post set ?';
    db.query(sql,post,(err,result)=>{
        if(err) throw err;
        res.send('Post added...');
        console.log(result);
    })
})
// getposts    
app.get("/getpost",(req,res)=>{
    let sql='select * from post';
    db.query(sql,(err,results)=>{ 
        if(!err)
            console.log('Post fetched...')
        res.json(results);
    })  
})
// getpost by id
app.get("/getpost/:id",(req,res)=>{   
    let sql=`select * from post where id=${req.params.id}`;
    db.query(sql,(err,result)=>{
        if(!err)
            console.log('Post fetched...')
        res.json(result);
    })
})
// update post
app.put('/updatepost/:id',(req,res)=>{
    const {id}=req.params;
    const {name,content}=req.body;
    let sql=`update post set name=? , content=? where id=?`;
    db.query(sql,[name,content,id],(err,result)=>{
        if(!err) 
            console.log('Post updated...')
        res.send(result);
    });
    })
// delete post
app.delete('/deletepost/:id',(req,res)=>{
    const {id}=req.params;
    let sql=`delete from post where id=?`
    db.query(sql,[id],(err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
}) 
