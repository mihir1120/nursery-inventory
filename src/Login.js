import React,{useState} from "react";

function Login({setLoggedIn}){

const [username,setUsername] = useState("");
const [password,setPassword] = useState("");

const handleLogin = async()=>{

const res = await fetch("/login",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
username,
password
})
});

const data = await res.json();

if(data.success){
localStorage.setItem("loggedIn",true);
setLoggedIn(true);
}else{
alert("Invalid login");
}

};

return(

<div style={{textAlign:"center",marginTop:"150px"}}>

<h2>Nursery Inventory Login</h2>

<input
placeholder="Username"
value={username}
onChange={(e)=>setUsername(e.target.value)}
/>

<br/><br/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<br/><br/>

<button onClick={handleLogin}>Login</button>

</div>

);

}

export default Login;