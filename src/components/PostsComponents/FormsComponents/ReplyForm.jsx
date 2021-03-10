import React from 'react'
import { Modal, Button } from 'react-materialize';
import firebase from 'firebase/app'
import 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import '../../../config/firebaseInit'
import {ReplyIcon} from '../../IconComponents/Icon';

const auth =firebase.auth()


function Reply(props) {
  const [user]=useAuthState(auth)
  
  return (
    <Modal 
      trigger={<Button className="btn reply-btn" title="reply button"><ReplyIcon/></Button>}
      id="new-form"
      actions={[
        <Button id="new-form-btn" modal="close" title="post button" onClick={(event)=>props.functions.handleNew(event,user,props.post._id)}>Post</Button>,
      ]}
    >
      <Button id="form-btn-close" modal="close" title="cancel reply button" className="right">X</Button>
      <form onSubmit={(event)=>props.functions.handleNew(event,user,props.post._id)}>
        <p className="form-title">Reply to Post</p>
        <div className="input-field">
        </div>
        <label htmlFor="">Comment</label>
        <br></br>
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

export default Reply
