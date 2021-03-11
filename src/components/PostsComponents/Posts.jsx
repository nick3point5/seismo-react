import React from 'react'
import './posts.css'
import EditForm from '../FormComponents/EditForm'
import ReplyForm from '../FormComponents/ReplyForm'
import { Link } from 'react-router-dom';
import 'firebase/auth'
import firebase from 'firebase/app'
import { useAuthState } from 'react-firebase-hooks/auth'
import logo from '../../assets/logo_small.png'
import '../../config/firebaseInit'
import { DeleteIcon } from '../IconComponents/Icon';

const auth = firebase.auth()

let deleteReady = false

function Posts(props) {
  const [user] = useAuthState(auth)
  let posts = ''

  if (props.posts && props.posts.length > 0) {
    posts = props.posts.map(post => {
      return postJSX(post, user, props.functions)
    })
  } else if (props.posts) {
    return postJSX(props.posts, user, props.functions)
  }
  return (
    <>
      {posts}
    </>
  )
}

function formatDate(date) {
  if (!date) {
    return undefined
  } else {
    date = new Date(date)
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    const result = new Intl.DateTimeFormat('en-US', options).format(date)

    return result
  }
}

function confirmDelete(id, deleteFunction) {
  if (deleteReady) {
    deleteFunction(id)
    deleteReady = false
  } else {
    const deleteButton = document.getElementById(id + '-delete-btn')
    deleteButton.classList.add('confirm')
    deleteButton.innerHTML = 'Yes'
    deleteReady = true
    setTimeout(() => {
      deleteButton.classList.remove('confirm')
      deleteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>'
      deleteReady = false
    }, 5000)
  }

}

function postJSX(post, user, functions) {
  if (!post._id) {
    return <></>
  } else {

    const formattedDate = formatDate(post.createdAt)

    return (

      <div className="post-card flex-r growin shadow base-card" key={post._id}>
        <div className="card-info flex-r">
          <Link to={{ pathname: `/user/${post.ownerId}`, state: post }} className="post-owner flex-c shadow" title={post.author + "'s account"}>
            <p className="post-username">{post.author}</p>
            <img src={post.img || logo} alt="" className="post-img" />
          </Link>
          <div className="card-content flex-c shadow" title="post details">
            <Link to={{ pathname: `/post/${post._id}`, state: post }} className="post-detail flex-c">
              <p className="text-content">{post.comment}</p>
              <div className="card-footer flex-r">
                <div className="card-stats flex-r">
                  <p className="post-date card-stat">{formattedDate}</p>
                  <p className="reply-count card-stat">Replies: {post.reply.length}</p>
                  <p className="mag card-stat">Magnitude: {Math.ceil(post.magnitude * 10) / 10}</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
        <div className="post-action flex-c">
          {user ?
            user.uid === post.ownerId ?
              <>
                <EditForm functions={functions} post={post} />
                <div className="delete-container flex-r">
                  <span className="confirm-message" id={post._id + '-confirm-message'}>Are You Sure?</span>
                  <button className="btn delete-btn" title="delete post"
                    id={post._id + '-delete-btn'}
                    onClick={() => {
                      confirmDelete(post._id, functions.handleDelete)
                    }
                    }>
                    <DeleteIcon /></button>
                </div>
              </> :
              <ReplyForm functions={functions} user={user} post={post} /> :
            <></>
          }
          {post.parent ?
            <Link to={{ pathname: `/post/${post.parent}`, state: post }} title="replied to post">
              <p className="reply-of-link">Reply of...</p>
            </Link> :
            <div className="reply-filler"></div>
          }
        </div>
      </div>
    )
  }
}

export default Posts
