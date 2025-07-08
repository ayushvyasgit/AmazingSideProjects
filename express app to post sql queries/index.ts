import express from "express";
import { Client } from "pg";
const app = express();
app.use(express.json());

const pgClient = new Client("postgresql://neondb_owner:npg_xrImHNkg1aq5@ep-tiny-haze-afj2836t-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require");

pgClient.connect();


app.post("/signup",async (req: { body: { username: any; password: any; email: any; }; }, res: { json: (arg0: { message: string; }) => void; })=>{
  const username = req.body.username;
  const password = req.body.password;
  const email    = req.body.email;

  try{const inertQuery = `INSERT INTO users (username , email ,password) VALUES ('${username}' , '${email}','${password}');`;
  const response = await pgClient.query(inertQuery);

  res.json({
    message:"you had sent  query "
  })}
  catch(e){
    res.json({
      message:"error";
    })
  }

})

app.listen(3000);