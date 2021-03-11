import React, { Component } from 'react'
import Posts from '../../components/PostsComponents/Posts'
import { withRouter, Redirect } from "react-router";
import './details.css'
import seismoApiUrl from "../../config/Api";
import { wsSeismoApiUrl } from "../../config/Api";
import firebase from 'firebase/app'
import 'firebase/auth'
import { Navbar } from '../../components/NavbarComponents/NavBar'

const socket = new WebSocket(wsSeismoApiUrl);
const auth = firebase.auth()

export class Details extends Component {

  state = {
    id: this.props.match.params.id,
    updatePosts: false,
  }

  componentDidMount() {
    this.fetchData(this.props.match.params.id)
    this.init.logo()
    this.init.socket()
  }

  componentDidUpdate() {
    if (this.props.match.params.id !== this.state.id) {
      this.fetchData(this.props.match.params.id)
      this.setState({
        id: this.props.match.params.id
      })
    }
    if (this.state.updatePost) {
      this.fetchData(this.props.match.params.id)
      this.setState({
        updatePosts: false
      })
    }
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
            updatePost: true
          })
        }
      };

    },
  }

  fetchData = (post_id) => {
    if (post_id.length !== 24) {
      this.setState({
        redirect: true
      })
    }
    fetch(`${seismoApiUrl}/post/${post_id}`, {
      method: 'GET'
    })
      .then(res => {
        return res.json()
      })
      .then(data => {
        if (data) {
          this.setState({
            post: data
          })
        } else {
          this.setState({
            redirect: true
          })
        }


      })
      .catch((err) => console.log(err));
    fetch(`${seismoApiUrl}/post/getposts/${post_id}`, {
      method: 'GET'
    })
      .then(res => {
        return res.json()
      })
      .then(data => {
        this.setState({
          replies: ''
        })
        if (data.length > 1) {
          this.setState({
            replies: data
          })
        } else if (data.length === 1) {
          this.setState({
            replies: data[0]
          })
        }

      })
      .catch((err) => console.log(err));

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
        document.getElementById('form-btn-close').click()
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
    follow: (user) => {
      const obj = {
        id: user.uid
      }

      fetch(`${seismoApiUrl}/user/follow/${this.state.profile._id}`, {
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
        .then((data) => {

          if (!data.message) {
            this.setState({
              followers: data
            })
          } else {
            console.log(data)
          }
        })

        .catch((err) => console.log(err));
    },
    unFollow: (user) => {
      const obj = {
        id: user.uid
      }


      fetch(`${seismoApiUrl}/user/unfollow/${this.state.profile._id}`, {
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
        .then((data) => {

          if (!data.message) {
            this.setState({
              followers: data
            })
          } else {
            console.log(data)
          }

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
      fetchData: this.fetchData
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
        <div className="post-details-page content">
          <div className="post-original">
            <Posts functions={postFunctions} posts={this.state.post} />
          </div>
          {this.state.replies ?
            <div className="replies">
              <Posts functions={postFunctions} posts={this.state.replies} />
            </div> :
            <></>
          }
        </div>
        {this.state.redirect ? <Redirect to="/" /> : ''}
      </>
    )
  }
}


export default withRouter(Details)
