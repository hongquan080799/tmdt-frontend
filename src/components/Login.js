import React,{useState} from 'react'
import './Login.css'
import {auth} from '../firebase'
import firebase from 'firebase'
import * as userApi from '../api/UserApi'
import { useHistory, Link } from 'react-router-dom'
export default function Login() {
    const history =  useHistory()
    const [loginInput,setLoginInput] = useState();
    // const responseFacebook = (res)=>{
    //     console.log({
    //         accessToken:res.accessToken,
    //         email:res.email,
    //         id:res.id,
    //     //    picture:res.picture.data.url,
    //         name:res.name
    //     })
    //     console.log(res)
    // }
    const handleChangeLoginInput = (e)=>{
        const {name,value} = e.target
        setLoginInput({
            ...loginInput,
            [name]:value
        })
    }
    const handleLoginFacebook = async ()=>{
        window.FB.login(function(response) {
            if (response.authResponse) {
             console.log('Welcome!  Fetching your information.... ');
             window.FB.api('/me', function(response) {
               console.log('Good to see you, ' + response.name + '.');
               window.FB.getLoginStatus(res=>{
                   const token = res.authResponse.accessToken
                   userApi.getLoginFacebook(token).then(res=>{
                    //history.push('/')
                    window.location.replace('/')
                })
                .catch(erro=>{
    
                })
               })
             });
            } else {
             console.log('User cancelled login or did not fully authorize.');
            }
        });
    }
    const submitLogin = async (e)=>{
        e.preventDefault();
       try {
            const response = await userApi.getLogin(loginInput)
            if(response != null){
                const user = await userApi.getUser();
                console.log(user)
                if(user.quyen == 'KHACHHANG')
                    window.location.replace('/')
                else if(user.quyen == 'ADMIN')
                    window.location.replace('/admin/index')
                else if(user.quyen == 'NHANVIEN')
                    window.location.replace('/admin/index')
            }
        
       } catch (error) {
            window.alert('Login failed')
       }

    }
    const handleLoginGoogle = async ()=>{
        var provider = new firebase.auth.GoogleAuthProvider();
        // provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        // auth.languageCode = 'it';
        provider.addScope('https://www.googleapis.com/auth/userinfo.profile,https://www.googleapis.com/auth/userinfo.email');
        auth
        .signInWithPopup(provider)
        .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;

            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            console.log(token)
            console.log(credential.idToken)
            userApi.getLoginGoogle(token).then(res=>{
                window.location.replace('/')
            })
            .catch(erro=>{

            })
            // ...
        }).catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
    }
    const checkUser = ()=>{
        auth.onAuthStateChanged(user =>{
            if(user)
            console.log(user)
            else
            console.log("u not logged in")
        })
    }
    return (
        <div className="myLoginContainer">
            <div className="login-container">
                <div className="login-container__left">
                    <div className="login-left">
                        <img src="https://img.icons8.com/dusk/128/000000/windows-logo.png"/>
                        <p className="left-text">
                            TOMORROW NEVER WAIT
                        </p>
                    </div>
                </div>
                <div className="login-container__right">
                    <form onSubmit={submitLogin}>
                        <p className="login__head">
                            LOGIN
                        </p>
                        <input type="text" className="form-control" placeholder="Enter your username" name="username" onChange={handleChangeLoginInput} />
                        <input type="password" className="form-control" placeholder="Enter your password" name="password" onChange={handleChangeLoginInput} />
                         <button className="login__button" type="submit">Login</button>
                        {/*<button onClick={checkUser} > checkuser</button>
                        <button onClick={()=>{
                             window.FB.logout(function(response){
                                      console.log("Logged Out!");
                                      
                                    });
                        }} > logout</button> */}
                        <hr/>
                        <button className="login__button-google" type="button" onClick={handleLoginGoogle}>Login with Google</button>
                        {/* <button className="login__button-google" onClick={()=>{
                            //  window.FB.getLoginStatus(function(response) {
                            //     window.FB.logout(function(response){
                            //       console.log("Logged Out!");
                                  
                            //     });
                            // //   });
                            // window.FB.api('/me', function(response) {
                            //     console.log('Good to see you, ' + response.name + '.');
                            //   });
                        }}>Login with Google</button> */}
                         <button className="login__button-facebook" type="button" onClick={handleLoginFacebook}>Login with Facebook</button>
                        {/* <FacebookLogin
                            appId="275950150983487"
                            autoLoad={true}
                            fields="name,email,picture"
                            callback={responseFacebook}
                            cssClass="login__button-facebook"
                            icon="fa-facebook"
                        /> */}
                        <hr/>
                        <div className="text-center">
                            <Link to="/register" ><p className="custom-link">Create an account</p><br/></Link>
                            <Link to="/restore"><p className="custom-link">Forgot password</p></Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
