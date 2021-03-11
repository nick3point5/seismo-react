import React from 'react'
import { Link } from 'react-router-dom';
import './navbar.css'
import Auth from './Auth'
import firebase from 'firebase/app'
import 'firebase/auth'
import logo from '../../assets/siesmo_name.png'
import NewForm from '../FormComponents/NewForm'
import { HomeIcon } from '../IconComponents/Icon';

const auth = firebase.auth()

export function Navbar(props) {

  const postFunctions = {
    handleNew: props.handle.new,
    handleChange: props.handle.change,
  }
  const authFunctions = {
    handleLogin: props.handle.login,
    handleLogout: props.handle.logout,
  }

  return (
    <>
      <header>
        <nav className="flex-r shadow base-card">
          <Link to="/">
            <div className="flex-r">
              <img src={logo} alt='Seismo-Logo' className="logo-img" id="nav-logo" />
            </div>
          </Link>
          <div>
            <ul className="nav-actions flex-r">
              {props.state.loggedIn ?
                <>
                  <li className="nav-item">{<NewForm functions={postFunctions} comment={props.state.comment} />}</li>
                  <li className="nav-item"><Link to={`/user/${auth.currentUser ? auth.currentUser.uid : ''}`} className="btn" title="my account">{<HomeIcon />}</Link></li>
                </> :
                ''}
              <li className="nav-item"><Auth user={props.state.user} functions={authFunctions} /></li>
            </ul>
          </div>
        </nav>
      </header>
    </>
  )
}


export default Navbar
