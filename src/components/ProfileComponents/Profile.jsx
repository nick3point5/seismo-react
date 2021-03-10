import React from 'react'
import { Link } from 'react-router-dom';
import './profile.css'
import logo from '../../assets/logo_small.png'
import 'firebase/auth'
import firebase from 'firebase/app'
import SettingsForm from '../PostsComponents/FormsComponents/SettingsForm'

const auth = firebase.auth()

export default function Profile(props) {
  let profile = ''
  if (props.state.profile) {
    profile = profileCard(props.state, props.functions)
  }
  return (
    profile
  )
}

function profileCard(state, functions) {
  const { profile, followers, following, displayName, about } = state
  const user = auth.currentUser

  function followersComp() {
    return (
      <div className="followers">
        <h3 className="followers-text">Followers</h3>
        <div className="user-icons-container">
          {followers ? followers.map(follower => {
            return (
              <Link to={`/user/${follower.uid}`} key={follower.uid}>
                <img src={follower.img || logo} alt={follower.username + ' icon image'} className="user-icon" title={follower.username} />
              </Link>
            )
          }) : ""}
        </div>

      </div>
    )
  }

  function followingComp() {
    return (
      <div className="following">
        <h3 className="following-text">Following</h3>
        <div className="user-icons-container">
          {following ? following.map(follow => {
            return (
              <Link to={`/user/${follow.uid}`} key={follow.uid}>
                <img src={follow.img || logo} alt={follow.username + ' icon image'} className="user-icon" title={follow.username} />
              </Link>
            )
          }) : ""}
        </div>

      </div>
    )
  }

  function checkFollowers(followers) {
    if (followers) {
      for (let i = 0; i < followers.length; i++) {
        if (followers[i].uid === user.uid) {
          return true
        }
      }
    }
    return false
  }

  return (
    <div className="profile-card flex-r shadow base-card">
      <div className="user-container flex-c center">
        <p className="profile-username">{profile.username}</p>
        <img src={profile.img || logo} alt={profile.username + ' profile image'} className="profile-img" />
      </div>
      <div className="about-container center">
        <p className="profile-about">{profile.about}</p>
      </div>

      <div className="other-users flex-c">
        {(user && (user.uid !== profile.uid)) ?
          (checkFollowers(followers) ?
            <button className="btn user-action-btn" onClick={() => { functions.handleUnFollow(user) }}>UnFollow</button> :
            <button className="btn user-action-btn" onClick={() => { functions.handleFollow(user) }}>Follow</button>) :
          (user && user.uid === profile.uid) ? <SettingsForm functions={functions} displayName={displayName} about={about} /> : ''
        }
        <div className="follow-container flex-r">
          <div className="divider-container d1">
            <div className="divider d1"></div>
          </div>
          {followersComp()}
          <div className="divider-container d2">
            <div className="divider d2"></div>
          </div>
          {followingComp()}
        </div>

      </div>


    </div>
  )
}
