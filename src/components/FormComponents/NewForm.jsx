import React from 'react'
import { Modal, Button } from 'react-materialize';
import firebase from 'firebase/app'
import 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import '../../config/firebaseInit'
import { PostIcon } from '../IconComponents/Icon';

const auth = firebase.auth()

function New(props) {
  const [user] = useAuthState(auth)
  return (
    <Modal
      trigger={<Button className="btn" title="new post"><PostIcon /></Button>}
      id="new-form"
      actions={[
        <Button id="new-form-btn" modal="close" onClick={(event) => props.functions.handleNew(event, user)}>Post</Button>,
      ]}
    >
      <Button id="form-btn-close" modal="close" className="right">X</Button>
      <form onSubmit={(event) => props.functions.handleNew(event, user)}>
        <p className="form-title">Create a new post</p>
        <div className="input-field">
        </div>
        <label className="form-label">Comment</label>
        <br />
        <input
          type="text"
          name="comment"
          id="comment"
          onChange={props.functions.handleChange}
          autoComplete="off"
          value={props.comment}
          minLength="1"
          maxLength="200"
          required
        />
      </form>
    </Modal>
  )
}

export default New
