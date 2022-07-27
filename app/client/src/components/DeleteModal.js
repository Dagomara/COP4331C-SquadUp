import React from "react";
import '../assets/stylesheets/deletemodal.css';

function DeleteModal(props) {
  let setDeleteModal = props.setDeleteModal;
  let setDeleteConfirm = props.setDeleteConfirm;  
  return (
    <div className="modalBackground text-white">
        <div className="modalContainer">
          {(props.deleteConfirm) && (
            <div className="modalContainer2">
              <div className="title"></div>
              <div className="body">
                <div className="body-border">
                  <p>Your account has now been deleted. We hope to see you again!</p>
                </div>
              </div>
              <div className="footer">
                <button id="cancelBtn">
                <a class="text-white" href="/">Go to Home</a>
                </button>
              </div>
            </div>
          )}
          {(!props.deleteConfirm) && (
            <div className="modalContainer2">
              <div className="titleCloseBtn">
                <button class="text-white" onClick={() => { setDeleteModal(false);  }}> X </button>
              </div>
              <div className="title">
                <div className="title-border">
                <img class="img-fluid rounded-circle" src={props.avatarURL} /><span>{props.username}</span>
                </div>
              </div>
              <div className="body">
              <div className="body-border">
                <p>Are you sure you want to delete your account? This action cannot be undone.</p>
              </div>
              </div>
              <div className="footer">
                <button onClick={() => { setDeleteModal(false);  }} id="cancelBtn">No</button>
                <button onClick={() => { setDeleteConfirm(true);  }}>Yes, Delete</button>
              </div>
           </div>
          )}
        </div>
      </div>
    
  );
}
  
  export default DeleteModal;