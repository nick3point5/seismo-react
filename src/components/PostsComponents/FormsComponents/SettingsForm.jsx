import React from 'react'
import { Modal, Button } from 'react-materialize';
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/storage'
import { useAuthState } from 'react-firebase-hooks/auth'
import { SettingsIcon } from '../../IconComponents/Icon';

const auth = firebase.auth()

function SettingsForm(props) {
  const [user] = useAuthState(auth)
  return (
    <form>
      <Modal
        trigger={<Button className="btn user-action-btn" title="change profile"><SettingsIcon /></Button>}
        actions={[<Button modal="close" onClick={() => { props.functions.handleUpdate(user) }}>Update</Button>,
        <Button modal="close" className="btn user-delete-btn delete-btn" onClick={() => { props.functions.handleUserDelete(user) }}>Delete</Button>]}
      >
        <p className="form-title">Change Profile</p>
        <div className="input-field">
        </div>
        <label htmlFor="">Username</label>
        <br />
        <input
          type="text"
          name="displayName"
          id="displayName"
          onChange={props.functions.handleChange}
          autoComplete="off"
          value={props.displayName}
          maxLength="12"
        />
        <br />
        <label htmlFor="">About</label>
        <br></br>
        <textarea
          type="text"
          name="about"
          id="about"
          onChange={props.functions.handleChange}
          autoComplete="off"
          value={props.about}
          maxLength="12"
        />
        <br />
        <label htmlFor="">Upload Profile Pic</label>
        <br />
        <input
          type="file"
          name="photo"
          id="photo"
          accept=".png, .jpg, .gif, .jpeg"
          onChange={props.functions.handleChange}
        />
      </Modal>
    </form>
  )
}

export default SettingsForm
