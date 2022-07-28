import React from 'react';
import axios from "axios";
import Navbar from '../components/Navbar';
import { Form, Field } from "@progress/kendo-react-form";
import { schools } from "../components/templates";
import { DropDown, Input } from "../components/formComponents";
import DeleteModal from '../components/DeleteModal';



import { HEROKU_ROOT_SERVER, HEROKU_ROOT_CLIENT, CLIENT_ID,
     LOCALHOST_ROOT_SERVER, LOCALHOST_ROOT_CLIENT } from '../assets/js/keys';
var serverRoot;
if (process.env.NODE_ENV == "production") {
    serverRoot = HEROKU_ROOT_SERVER;
}
else {
    serverRoot = LOCALHOST_ROOT_SERVER;
}
const clientId = CLIENT_ID;

const tagValidator = (value) => {
  let n = parseInt(value);
  // console.log("value information: ", (value && value.length ? value.length: value));
  // console.log("n: ", n, !isNaN(n) ? " a real number" : " a NaN");
  // console.log("in bounds? ", n >= 0 && n < 10000)
  return (value == "" || (!isNaN(n) && n >= 0 && n < 10000 && value.length == 4)) ? "" : "This tag is invalid!";
}

//axios.method('url', data(if needed), {withCredentials: true})



class Settings extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            login : false,
            username : "Loading User",
            discordId: 0,
            avatar: undefined,
            avatarURL: undefined,
            tag: "0000",
            gender: undefined,
            school: undefined,
            saveSuccess: "",
            loginRedirect: false,
            modalDelete: false,
            deleteConfirm: false
        };
        this.sendSettings = async(data, event) => {
          console.log("settings sent!");
          let info = {
            discordID: this.state.discordId,
            username: data.username || this.state.username,
            gender: data.gender || this.state.gender,
            school: data.school || this.state.school,
            tag: data.tag || this.state.tag
          };
          console.log(info);
          await axios.patch(`${serverRoot}/api/editProfile`, info)
          .then(res => {
            this.setState({
              saveSuccess: "Success!",
              username: res.data.username,
              tag: res.data.tag,
              gender: res.data.gender,
              school: res.data.school
            });
          }).catch((err)=>{
            console.log(err);
            this.setState({
              saveSuccess: err.message,
            });
          });
          
        
          event.preventDefault();
        };

        this.setDelete = (val) => {
          this.setState({
            modalDelete: val
          }); 
        }

        this.setDeleteConfirm = (val) => {
          this.setState({
            deleteConfirm: val
          }); 
        }

        this.accountDelete = async () => {
          await axios.post(`${serverRoot}/api/deleteAccount`, {discordID: this.state.discordId})
          .then(res => {
            console.log("Account Deleted: ", res.status);
            return true;
          })
          .catch((err)=>{console.log("deleteAccount Error!\n", err)});
          return false;
        }
      }

    // detects user login status, kicks them away if not logged in
    // GETTING THE USER DATA
    componentDidMount = async () => {
      await axios.get(`${serverRoot}/auth/getUserData`, {withCredentials: true})
      .then(async res => {
        console.log("res.data.login: " + res.data.login);
        if(res.data.login) {
          this.setState({
            login: true,
            username : res.data.username,
            discordId: res.data.discordId,
            avatar: res.data.avatar,
            avatarURL: `https://cdn.discordapp.com/avatars/${res.data.discordId}/${res.data.avatar}.png`,
            tag: res.data.tag
          });
          await axios.post(`${serverRoot}/api/viewProfile`, {discordID: res.data.discordId})
          .then(res2 => {
              if (res2.data) {
                  console.log("res2.data: ", res2.data);
                  this.setState({
                      username: res2.data.username,
                      tag: res2.data.tag,
                      gender: res2.data.gender,
                      school: res2.data.school
                  });
                  console.log("updated state w/ gender+school: ", this.state);
              }
          })
        }
        else {
          // Redirect to login page if user was not logged in!
          this.setState({loginRedirect: true});
        }
      }).catch((err)=>{
        console.log(err);
      });
    }

    

    render() {
      if (this.state.loginRedirect) return (
        <div className='redirectNotice'>
          <button className='btn btn-primary'>
            <a href="/" className='text-white'>Not logged in. Please go to login page!</a>
          </button>
        </div>
      )

      return (
        <div className='Settings' id='page-top'>
          {this.state.modalDelete && (<DeleteModal
            setDeleteModal={this.setDelete}
            username={this.state.username}
            avatarURL={this.state.avatarURL}
            deleteConfirm={this.state.deleteConfirm}
            setDeleteConfirm={this.setDeleteConfirm}
            accountDelete={this.accountDelete}
          />)}
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.12.0/css/all.css"></link>
          {!this.state.modalDelete && (
          <div id="wrapper">
            <Navbar username={this.state.username} avatarURL={this.state.avatarURL} page="settings"/>
            <div className="d-flex flex-column" id="content-wrapper">
                <div id="content">
                <div className="non-semantic-protector">
                    <div className="container mb-4 topbar static-top">
                    <h1 className="ribbon"><em><strong className="text-uppercase fw-bolder ribbon-content">My Settings</strong></em></h1>
                    </div>
                    <div className="container-fluid">
                    <div className="row mb-3 text-white">
                        <div className="col-lg-4">
                        <div className="card mb-3">
                            <div className="card-body text-center shadow"><img className="rounded-circle mb-3 mt-4" src={this.state.avatarURL}                  onError={({ currentTarget }) => {
                            currentTarget.onerror = null;
                            currentTarget.src="https://better-default-discord.netlify.app/Icons/Gradient-Pink.png";}} 
                            width={160} height={160} />
                            <div>
                                <p className="profile-username"><span>@</span>{this.state.username}<span>#{this.state.tag}</span></p>
                                <p className="profile-subheading text-capitalize">{this.state.school || "No School"}, {this.state.gender || "No Gender"}<br /></p>
                            </div>
                            </div>
                        </div>
                        </div>
                        <div className="col-lg-8">
                        <div className="row">
                            <div className="col">
                            <Form
                                onSubmit={this.sendSettings}
                                initialValues={{}}
                                render={(formRenderProps) => (
                                  <div className="card shadow mb-3">
                                    <div className="card-header py-3">
                                    <p className="m-0 fw-bold">User Settings</p>
                                    </div>
                                    <div className="card-body">
                                    <form onSubmit={formRenderProps.onSubmit}>
                                        <div className="row">
                                        <div className="col">
                                            <div className="mb-3">
                                              <label className="form-label" htmlFor="username">
                                                <strong>Username</strong>
                                              </label>
                                              <Field
                                                name="username"
                                                fieldType="text"
                                                value=""
                                                component={Input}
                                                placeholder={`${this.state.username}`}
                                                classNames="form-control text-black"/>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="mb-3">
                                              <label className="form-label" htmlFor="tag">
                                                <strong>Tag</strong>
                                              </label>
                                              <Field
                                                name="tag"
                                                fieldType="text"
                                                validator={tagValidator}
                                                component={Input}
                                                placeholder={`${this.state.tag}`}
                                                value=""
                                                classNames="form-control text-black"/>
                                            </div>
                                        </div>
                                        </div>
                                        <div className="row">
                                        <div className="col">
                                            <div className="mb-3">
                                              <label className="form-label" htmlFor="school">
                                                <strong>School</strong>
                                              </label>
                                              <Field 
                                                name="school"
                                                component={DropDown}
                                                value=""
                                                options={schools}/>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="mb-3">
                                              <label className="form-label" htmlFor="gender">
                                                <strong>Gender</strong>
                                              </label>
                                              <Field 
                                                name="gender"
                                                value=""
                                                component={DropDown}
                                                options={["Male", "Female", "Other"]}/>
                                            </div>
                                        </div>
                                        </div>
                                        <div className="mb-3">
                                          <button className="btn btn-primary btn-sm bg-gradient-primary" type="submit" disabled={!formRenderProps.allowSubmit}>Save Settings</button>
                                          <p className={this.state.saveSuccess == "Success!" ? "online" : "away"}>{this.state.saveSuccess}</p>
                                        </div>
                                    </form>
                                    </div>
                                </div>
                                )}>
                            </Form>
                            
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                            <div className="card shadow mb-3">
                                <div className="card-header py-3">
                                <p className="m-0 fw-bold">See Blocked Users</p>
                                </div>
                                <div className="card-body"><button className="btn btn-danger" type="button" onClick={(e) => {e.preventDefault(); window.location.href='/blocked';}}>See Blocked Users</button></div>
                            </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                            <p/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                            <div className="card shadow mb-3">
                                <div className="card-header py-3">
                                <p className="m-0 fw-bold">Delete Account</p>
                                </div>
                                <div className="card-body">
                                  <button className="btn btn-danger" type="button" onClick={() => {
                                    this.setState({modalDelete: true});
                                    }}>
                                    DELETE ACCOUNT
                                  </button>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
            </div>
          </div>
        </div>
      </div>
          </div>)}
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
          <script src="../assets/js/theme.js"></script>
        </div>
      );
    }
}

export default Settings;