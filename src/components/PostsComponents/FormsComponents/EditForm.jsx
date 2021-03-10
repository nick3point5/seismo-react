import React from 'react'
import { Modal, Button } from 'react-materialize';
import {EditIcon} from '../../IconComponents/Icon';
import './form.css'

function Edit(props) {

  return (
        <Modal 
        trigger={<Button className="btn edit-btn" title="edit post"><EditIcon/></Button>}
        id="new-form"
        actions={[
          <Button id="edit-form-btn" modal="close" onClick={(event)=>props.functions.handleUpdate(event,props.post._id)}>Post</Button>,
        ]}
      >
        <Button id="form-btn-close" modal="close" className="right">X</Button>
        <form onSubmit={(event)=>props.functions.event(event,props.post._id)}>
          <p className="form-title">Edit Post</p>
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

export default Edit
