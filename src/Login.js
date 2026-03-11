
import React,{useState} from "react"

function Login({onLogin}){

const [username,setUsername] = useState("")
const [password,setPassword] = useState("")

const login = async ()=>{

const res = await fetch("http://localhost:5000/login",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({username,password})
})

if(res.status === 200){
onLogin(true)
}else{
alert("Invalid login")
}

}

return(

<div style={{textAlign:"center",marginTop:"100px"}}>

<h2>Nursery Inventory Login</h2>

<input
placeholder="Username"
onChange={(e)=>setUsername(e.target.value)}
/>

<br/><br/>

<input
type="password"
placeholder="Password"
onChange={(e)=>setPassword(e.target.value)}
/>

<br/><br/>

<button onClick={login}>
Login
</button>

</div>

)

}

export default Login