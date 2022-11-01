import { useState } from 'react'
import { getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import { useRouter } from 'next/router';
import { auth } from '../../firebase.config';
import Head from 'next/head';

// import logo from '../../Assets/logo.png'


function Login(props) {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loader, setLoader] = useState(false)
  const router = useRouter();

  const handleLogin = ()=>{
    setLoader(true)
    if(!email || !password){
      alert("Please enter all fields")
      return
    }
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setLoader(false)
        console.log(userCredential.user);
        router.push('/admin/appoinments')
      })
      .catch((error) => {
        alert(error.code)
        setLoader(false)
    });
  }

  const handleKeyDown = (e)=>{
    if(e.key === 'Enter'){
      handleLogin()
    }
  }

  return (
    <>
    <Head>
    <title>Login | GHC</title>
    <meta name="description" content="Growth starts here" />
    <link rel="icon" href="/favicon.ico" />
  </Head>
      {loader && <div className="login-loader"><span>.</span></div>}
      <div className="login-top">
        <div className="login-logo">
          {/* <img src={logo} alt="" /> */}
        </div>
        <div className="login-box">
          <h1>GHC Admin Panel</h1>
          <div className="login-inp">
            <label htmlFor="">Email</label>
            <input type="email" onKeyDown={handleKeyDown} value={email} onChange={(e)=>{setEmail(e.target.value)}} name="username" id="" />
          </div>
          <div className="login-inp">
            <label htmlFor="">Password</label>
            <input type="password" onKeyDown={handleKeyDown} value={password} onChange={(e)=>{setPassword(e.target.value)}} name="pass" id="" />
          </div>
          <div className="buttons-login">
            <button onClick={handleLogin} className="login-but">
              Login
            </button>
          </div>
          
        </div>
      </div>
    </>
  )
}

export default Login