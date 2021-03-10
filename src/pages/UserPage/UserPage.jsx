import React, { Component } from 'react'
import Posts from '../../components/PostsComponents/Posts'
import Profile from '../../components/ProfileComponents/Profile'
import { withRouter, Redirect } from "react-router";
import seismoApiUrl from "../../config/Api";
import firebase from 'firebase/app'
import 'firebase/auth'
import {Navbar} from '../../components/NavbarComponents/NavBar'


const auth =firebase.auth()
export class UserPage extends Component {
  state={
    id:this.props.match.params.id,
    photo:'',
    profile: '',
    displayName: '',
    about:''
  }

  componentDidMount(){
    this.fetchData.all(this.props.match.params.id)
    const logoEle = document.getElementById("nav-logo");
		logoEle.addEventListener("mouseover", () => {
			logoEle.classList.add("shake");
		});
		logoEle.addEventListener("mouseout", () => {
			logoEle.classList.remove("shake");
		});
  }

  componentDidUpdate() {
    if (this.props.match.params.id !== this.state.id) {
      
      this.fetchData.all(this.props.match.params.id)
      this.setState({
        id:this.props.match.params.id
      })
    }
  }

  fetchData={
    user:(user_id)=>{
      fetch(`${seismoApiUrl}/user/${user_id}`,{
        method:'GET'
      })
        .then(res=>{
          return res.json()
        })
        .then(data=>{
          if(data){
            this.setState({
              profile: data,
              displayName: data.username,
              about:data.about
            })
          }else{
            this.setState({
              redirect:true
            })
          }
        })
    },
    followers:(user_id)=>{
      fetch(`${seismoApiUrl}/user/getfollowers/${user_id}`,{
        method:'GET'
      })
        .then(res=>{
          return res.json()
        })
        .then(data=>{
          this.setState({
            followers: data
          })
        })
    },
    following:(user_id)=>{
      fetch(`${seismoApiUrl}/user/getfollowing/${user_id}`,{
        method:'GET'
      })
        .then(res=>{
          return res.json()
        })
        .then(data=>{
          this.setState({
            following: data
          })
        })
    },
    userPosts:(user_id)=>{
      fetch(`${seismoApiUrl}/user/getposts/${user_id}`,{
        method:'GET'
      })
        .then(res=>{
          return res.json()
        })
        .then(data=>{
          this.setState({
            recentPosts: data,
          })
        })
    },
    feedTime:(user_id)=>{
      fetch(`${seismoApiUrl}/user/feedtime/${user_id}`,{
        method:'GET'
      })
        .then(res=>{
          return res.json()
        })
        .then(data=>{
          this.setState({
            feedTimePost: data
          })
        })
    },
    feedMag:(user_id)=>{
      fetch(`${seismoApiUrl}/user/feedmag/${user_id}`,{
        method:'GET'
      })
        .then(res=>{
          return res.json()
        })
        .then(data=>{
          this.setState({
            feedMagPost: data
          })
        })
    },
    all:(user_id)=>{
      this.fetchData.user(user_id)
      this.fetchData.userPosts(user_id)
      this.fetchData.followers(user_id)
      this.fetchData.following(user_id)
      this.fetchData.feedTime(user_id)
      this.fetchData.feedMag(user_id)
    }
  }

  handle={
    change:(event)=>{
      event.preventDefault();
      if (event.target.files&&event.target.files[0]) {
        this.setState({  
          photo:event.target.files[0]
        });
      } else{
        this.setState({
          [event.target.id]:event.target.value
        });
      }
    },
    new:(event,user,postId='')=>{
      event.preventDefault()  
      const obj = {
        comment: this.state.comment,
        author: user.displayName,
        ownerId: user.uid,
        img: user.photoURL,
      }
      document.getElementById('form-btn-close').click()
      
      
      fetch(`${seismoApiUrl}/post/${postId}`,{
          method: 'Post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            obj
          ),
        })
        .then((res)=>{
          this.fetchData.userPosts(this.props.match.params.id)
          this.fetchData.feedTime(this.props.match.params.id)
          this.fetchData.feedMag(this.props.match.params.id)
          this.setState({
            comment:''
          })
        }
        )
        .catch((err) => console.log(err));
    },
    update:(event,postId='')=>{
      
      event.preventDefault()
      const obj = {
        comment: this.state.comment,
      }
      
      fetch(`${seismoApiUrl}/post/${postId}`,{
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            obj
          ),
        })
        .then((res)=>{
          this.fetchData.userPosts(this.props.match.params.id)
          this.setState({
            comment:''
          })
        }
        )
        .catch((err) => console.log(err));
    },
    delete:(postId) => {
      fetch(`${seismoApiUrl}/post/${postId}`, {
        method: 'DELETE',
      })
      .then((response) => {
        return response.json();
      })
      .then(() => {
        this.fetchData.userPosts(this.props.match.params.id)
      })
      .catch((err) => console.log(err));
    },
    userDelete:(user) => {
      console.log(user.uid)
      auth.signOut()
      user.delete().then(function() {
      }).catch(function(error) {
      });
      
      fetch(`${seismoApiUrl}/user/${user.uid}`, {
        method: 'DELETE',
      })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data)
        this.setState({
          redirect:true
        })
      })
      .catch((err) => console.log(err));
    },
    follow:(user)=>{
      const obj={
        id: user.uid
      }
      
      fetch(`${seismoApiUrl}/user/follow/${this.state.profile._id}`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            obj
          ),
        })
        .then((res) => {
          return res.json()
        })
        .then((data)=>{
          
          if (!data.message) {
            this.setState({
              followers: data
            })
          }else{
            console.log(data)
          }
        })
        
        .catch((err) => console.log(err));
    },
    unFollow:(user)=>{
      const obj={
        id: user.uid
      }
      
      
      fetch(`${seismoApiUrl}/user/unfollow/${this.state.profile._id}`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            obj
          ),
      })
        .then((res) => {
          return res.json()
        })
        .then((data)=>{
          
          if (!data.message) {
            this.setState({
              followers: data
            })
          }else{
            console.log(data)
          }
  
        })
  
        .catch((err) => console.log(err));
    },
    active:(id)=>{
      const posts = document.querySelectorAll('.profile-posts')
      document.querySelectorAll('.profile-nav-item').forEach((item,i)=>{
        if (i !== id) {
          item.classList.remove('active')
          posts[i].classList.add('hidden')
        }else{
          item.classList.add('active')
          posts[i].classList.remove('hidden')
        } 
        
      })
      
    },
    updateProfile:(user)=>{
      if (this.state.photo) {
        firebase.storage()
        .ref(`users/${user.uid}/profile.png`)
        .put(this.state.photo)
        .then((snapshot)=>{
          snapshot.ref.getDownloadURL()
            .then((downloadURL)=>{
              const updateObj={
                displayName: this.state.displayName,
                photoURL: downloadURL
              }
  
              user.updateProfile(
                updateObj
              )
  
              const obj = {
                username: this.state.displayName,
                img: downloadURL,
                about: this.state.about,
              }
              
              fetch(`${seismoApiUrl}/user/${user.uid}`,{
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(
                    obj
                  ),
                })
                .then(() => {
                  this.fetchData.user(this.props.match.params.id)
                  this.setState({
                    photo: ''
                  })
                })
                .catch((err) => console.log(err));
  
            })
            .catch((err)=>console.log(err))
        })
        
      }else{
        const updateObj = {
          username: this.state.displayName,
          about: this.state.about,
        }

        fetch(`${seismoApiUrl}/user/${user.uid}`,{
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            updateObj
          ),
        })
        .then(() => {
          this.fetchData.user(this.props.match.params.id)
          user.updateProfile({
              displayName: this.state.displayName
          })
  
          this.setState({
            photo: ''
          })
        })
        .catch((err) => console.log(err));
  
      }
      
    },
    login:(user)=>{
      const obj = {
        username: user.displayName,
        uid: user.uid,
        img: user.photoURL
      }
  
      fetch(`${seismoApiUrl}/user/login`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          obj
        ),
      })
      .then((res)=>{
        this.setState({
          user: auth.currentUser,
          loggedIn:true
        })
        return res.json();
      })
      .catch((err) => console.log(err));
    },
    logout:()=>{
      auth.signOut()
      this.setState({
        user: auth.currentUser,
        loggedIn:false
      })    
    },
  }
  
  render() {
    const postFunctions = {
      handleNew:this.handle.new,
      handleChange:this.handle.change,
      handleDelete:this.handle.delete,
      handleUpdate:this.handle.update,
    }

    const profileFunctions ={
      handleFollow:this.handle.follow,
      handleUnFollow:this.handle.unFollow,
      fetchFollowers:this.fetchData.followers,
      handleChange:this.handle.change,
      handleUpdate:this.handle.updateProfile,
      handleUserDelete:this.handle.userDelete,
    }

    const profileState={
      profile:this.state.profile,
      followers:this.state.followers,
      following:this.state.following,
      displayName:this.state.displayName,
      about:this.state.about,
    }

    const navFunctions = {
      new:this.handle.new,
      change:this.handle.change,
      login:this.handle.login,
      logout:this.handle.logout,
    }

    return (
      <>
        <Navbar handle={navFunctions} state={this.state}/>
        <div className="user-page content">
          <div className="profile-owner growin">
            <Profile functions={profileFunctions} state={profileState}/>
            
          </div>
          <div className="profile-nav flex-r">
            <div className="profile-nav-item active growin" id="recent-posts-tab" onClick={()=>{
              this.handle.active(0)
            }}
            >
              <p className="profile-nav-item-btn">Recent Posts</p>
            </div>
            <div className="profile-nav-item" id="recent-feed-tab" onClick={()=>{
              this.handle.active(1)
            }}>
              <p className="profile-nav-item-btn">Recent Feed</p>
            </div>
            <div className="profile-nav-item" id="mag-feed-tab" onClick={()=>{
              this.handle.active(2)
            }}>
              <p className="profile-nav-item-btn">Magnitude Feed</p>
            </div>
          </div>
          {this.state.recentPosts?
            <div className="recent-posts profile-posts">
              <Posts functions={postFunctions} posts={this.state.recentPosts}/>
            </div>:
            <></>
          }
          {this.state.feedTimePost?
            <div className="feed-time profile-posts hidden">
              <Posts functions={postFunctions} posts={this.state.feedTimePost}/>
            </div>:
            <></>
          }
          {this.state.feedMagPost?
            <div className="feed-mag profile-posts hidden">
              <Posts functions={postFunctions} posts={this.state.feedMagPost}/>
            </div>:
            <></>
          }
        </div>
        {this.state.redirect?<Redirect to="/"/>:''}
      </>
      
    )
  }
}


export default withRouter(UserPage)
