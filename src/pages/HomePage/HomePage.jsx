import React, { Component } from 'react'
import './homepage.css'
import Posts from '../../components/PostsComponents/Posts'
import seismoApiUrl from "../../config/Api";
import { wsSeismoApiUrl } from "../../config/Api";
import firebase from 'firebase/app'
import 'firebase/auth'
import { Navbar } from '../../components/NavbarComponents/NavBar'

const socket = new WebSocket(wsSeismoApiUrl);
const auth = firebase.auth()
export class HomePage extends Component {
  state = {
    posts: '',
    updatePosts: false,
  }

  componentDidMount() {
    this.fetchData()
    this.init.logo()
    this.init.socket()
  }

  componentDidUpdate() {
    if (this.state.updatePosts) {
      this.fetchData()
      this.setState({
        updatePosts: false
      })
    }
  }

  fetchData = () => {
    fetch(`${seismoApiUrl}/post/get10`, {
      method: 'GET'
    })
      .then(res => {
        return res.json()
      })
      .then(data => {
        this.setState({
          topPosts: data
        })
      })
      .catch((err) => console.log(err));
  }

  init = {
    logo: () => {
      const logoEle = document.getElementById("nav-logo");
      logoEle.addEventListener("mouseover", () => {
        logoEle.classList.add("shake");
      });
      logoEle.addEventListener("mouseout", () => {
        logoEle.classList.remove("shake");
      });
    },
    socket: () => {
      socket.onmessage = (message) => {
        let data = JSON.parse(message.data);

        if (data.message === 'updatePosts') {
          this.setState({
            updatePosts: true
          })
        }
      };

    },
  }

  handle = {
    change: (event) => {
      event.preventDefault();
      this.setState({
        [event.target.id]: event.target.value
      });
    },
    new: (event, user, postId = '') => {
      event.preventDefault()
      const obj = {
        comment: this.state.comment,
        author: user.displayName,
        ownerId: user.uid,
        img: user.photoURL,
      }

      if (document.getElementById('form-btn-close')) {
        document.querySelectorAll('#form-btn-close').forEach(x => x.click())
      }

      fetch(`${seismoApiUrl}/post/${postId}`, {
        method: 'Post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          obj
        ),
      })
        .then((res) => {
          socket.send(JSON.stringify({ message: 'updatePosts' }))
          this.setState({
            comment: ''
          })
        }
        )
        .catch((err) => console.log(err));
    },
    update: (event, postId = '') => {
      event.preventDefault()
      const obj = {
        comment: this.state.comment,
      }


      fetch(`${seismoApiUrl}/post/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          obj
        ),
      })
        .then((res) => {
          socket.send(JSON.stringify({ message: 'updatePosts' }))
          this.setState({
            comment: ''
          })
        }
        )
        .catch((err) => console.log(err));
    },
    delete: (postId) => {
      fetch(`${seismoApiUrl}/post/${postId}`, {
        method: 'DELETE',
      })
        .then((response) => {
          return response.json();
        })
        .then(() => {
          socket.send(JSON.stringify({ message: 'updatePosts' }))
        })
        .catch((err) => console.log(err));
    },
    login: (user) => {
      const obj = {
        username: user.displayName,
        uid: user.uid,
        img: user.photoURL
      }

      fetch(`${seismoApiUrl}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          obj
        ),
      })
        .then((res) => {
          this.setState({
            user: auth.currentUser,
            loggedIn: true
          })
          return res.json();
        })
        .catch((err) => console.log(err));
    },
    logout: () => {
      auth.signOut()
      this.setState({
        user: auth.currentUser,
        loggedIn: false
      })
    },
  }

  render() {

    const postFunctions = {
      handleNew: this.handle.new,
      handleChange: this.handle.change,
      handleDelete: this.handle.delete,
      handleUpdate: this.handle.update,
      fetchData: this.fetchData,

    }

    const navFunctions = {
      new: this.handle.new,
      change: this.handle.change,
      login: this.handle.login,
      logout: this.handle.logout,
    }

    return (
      <>
        <Navbar handle={navFunctions} state={this.state} />
        <div className="home-page content">
          <div className="home-nav-item top-post-nav active center">
            <p>Top Earthquakes</p>
          </div>

          <Posts functions={postFunctions} posts={this.state.topPosts} />
        </div>
      </>
    )
  }
}



export default HomePage
