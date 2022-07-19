import React from "react";
import {useForm} from "react-hook-form";

export default function WelcomeForm(props) {
    console.log("props: ", props);
    const [formStep, setFormStep] = React.useState(0);
    const {watch, handleSubmit} = useForm();
    const onSubmit = data => console.log(data);

    const completeFormStep = () => {
        setFormStep(cur => cur + 1);
      }

    const backpedalFormStep = () => {
        setFormStep(cur => cur - 1);
    }

    if (true)
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...watch("firstName")} />
          <select {...watch("gender")}>
            <option value="female">female</option>
            <option value="male">male</option>
            <option value="other">other</option>
          </select>
          <input type="submit" />
        </form>
      );
    else 
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {formStep === 0 && (
            <div className="p-5 splash-section">
                <div className="text-center">
                    <h1 className="fw-bold text-white mb-4 splash-heading"><img className="rounded-circle" src={props.avatarURL} style={{marginRight: '30px'}} />Welcome {props.username}<span style={{color: 'gray'}}>#{props.tag}</span>!</h1>
                    </div>
                    <hr />
                <div className="row mb-3">
                    <div className="col-sm-12 col-xl-12 align-self-center mb-3 mb-sm-0 splash-box py-4">
                        <p className="text-white">On SquadUP, you can go by any username. Is this the one you'd like to use?</p>
                        <input className="form-control form-control-user" type="text" placeholder={`@${props.username}`} name="username" {...watch("username")}/>
                    </div>
                    <div className="col-sm-12 col-xl-12 align-self-center mb-3 mb-sm-0 splash-box py-4 mt-3">
                        <p className="text-white">Would you like to enter your school?</p>
                        <input className="form-control form-control-user" type="text" placeholder="School" name="school" {...watch("shcool")}/>
                    </div>
                    <div className="col-sm-12 col-xl-12 align-self-center mb-3 mb-sm-0 splash-box py-4 mt-3">
                        <p className="text-white">Would you like to enter your gender?</p>
                        <select className="form-select form-control-user">
                            <option value="12" selected="">Male</option>
                            <option value="13">Female</option>
                            <option value="14">Other</option>
                        </select>
                    </div>
                </div>
                <div className="mb-3"></div>
                <hr />
                <div class="row">
                <div class="col"></div>
                <div class="col text-end"><button class="btn btn-primary bg-gradient-primary" onClick={completeFormStep} type="button">Next &gt;</button></div>
                </div>
                
            </div>)}
            {formStep === 1 && (
            <div className="p-5 splash-section">
                <div className="text-center">
                    <h1 className="fw-bold text-white mb-4 splash-heading"><img className="rounded-circle" src={props.avatarURL} style={{marginRight: '30px'}} />Welcome {props.username}<span style={{color: 'gray'}}>#{props.tag}</span>!</h1>
                    </div>
                    <hr />
                <div className="row mb-3">
                    <div className="col-sm-12 col-xl-12 align-self-center mb-3 mb-sm-0 splash-box py-4">
                        <p className="text-white">What games do you play?</p><input className="form-control form-control-user" type="text" placeholder={`@${props.username}`} name="games" {...watch("games")}/>
                    </div>
                </div>
                <div className="mb-3"></div>
                <hr />
                <div class="row">
                <div class="col"><button class="btn btn-primary fw-bold bg-gradient-danger" onClick={backpedalFormStep} type="button">&lt;&nbsp;Back</button></div>
                <div class="col text-end"><button class="btn btn-primary bg-gradient-primary" onClick={completeFormStep} type="submit">Finish</button></div>
                </div>
            </div>)}
            {formStep === 2 && (
            <div className="p-5 splash-section">
                <div className="text-center">
                    <h1 className="fw-bold text-white mb-4 splash-heading"><img className="rounded-circle" src={props.avatarURL} style={{marginRight: '30px'}} />Welcome {props.username}<span style={{color: 'gray'}}>#{props.tag}</span>!</h1>
                    </div>
                    <hr />
                <div className="row mb-3">
                    <div className="col-sm-12 col-xl-12 align-self-center mb-3 mb-sm-0 splash-box py-4">
                        <p className="text-white" style={{marginBottom: '0px'}}>What roles do you play for each game?</p>
                    </div>
                    <div className="col-sm-12 col-xl-12 align-self-center mb-3 mb-sm-0 splash-box py-4">
                        <p className="text-white">Team Fortress 2</p>
                        <div className="row splash-option">
                            <div className="col-sm-12 col-md-3 text-start align-self-center">
                                <p className="w-100">Level</p>
                            </div>
                            <div className="col align-self-center"><input className="form-control" type="text" /></div>
                        </div>
                        <div className="row splash-option">
                            <div className="col-sm-12 col-md-3 align-self-center">
                                <p>Positions</p>
                            </div>
                            <div className="col text-start align-self-center"><input className="form-control" type="text" /></div>
                        </div>
                    </div>
                </div>
                <div className="mb-3"></div>
                <hr />
                <div class="row">
                <div class="col"><button class="btn btn-primary fw-bold bg-gradient-danger" onClick={backpedalFormStep} type="button">&lt;&nbsp;Back</button></div>
                <div class="col text-end"><button class="btn btn-primary bg-gradient-primary" onClick={completeFormStep} type="button">Next &gt;</button></div>
                </div>
            </div>)}
            <pre>
            {JSON.stringify(watch(), null, 2)}
            </pre>
        </form>
    )
}