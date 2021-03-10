import React from 'react'
import '../../config/firebaseInit'
import firebase from 'firebase/app'
import 'firebase/auth'
import { Modal, Button } from 'react-materialize';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { useAuthState } from 'react-firebase-hooks/auth'
import {LoginIcon,LogoutIcon} from '../IconComponents/Icon';

const auth = firebase.auth()

function Auth(props) {
  const [user]=useAuthState(auth)
  
  if (user !== props.user && user) {
    const login =(user)=>{
      props.functions.handleLogin(user)
    }
    login(user)
  }

  return (
    <>
      {user? <SignOut functions={props.functions}/>:<SignIn/>}
    </>
  )
}

function SignOut(props) {
  
  return auth.currentUser && (
    <div className="">
      <button onClick={()=> {props.functions.handleLogout()}} className="btn" title="logout"><LogoutIcon/></button>
    </div>
  )
}

const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ]
};

function SignIn() {

  return (
    <Modal 
      trigger={<div className="btn" title="login"><LoginIcon/></div>}
      actions={<Button modal="close" className="btn">X</Button>}
    >

    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>

    </Modal>
  )
}

export default Auth
