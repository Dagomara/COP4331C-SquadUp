import React, { Component } from "react";
import { Form, Field } from "@progress/kendo-react-form";
import { MultiSelect } from "@progress/kendo-react-dropdowns";
import { countries, schools, games } from "./templates";
import { gameTemplates } from "../assets/js/gameTemplates";
import '@progress/kendo-theme-default/dist/all.css';


// USING KendoUI trial: https://www.telerik.com/kendo-react-ui/my-license/
// `npx kendo-ui-license activate` must be run I think before launching app on new device
// License expires on 8/18/2022.

const Input = (fieldProps) => {
  const {
    fieldType, label, value, visited, touched, valid,
    onChange, onBlur, onFocus, validationMessage, 
    placeholder, classNames
  } = fieldProps;
  const invalid = !valid && visited;
  return (
    <div onBlur={onBlur} onFocus={onFocus}>
        <input
          type={fieldType}
          className={invalid ? "invalid "+classNames : ""+classNames}
          value={value}
          onChange={onChange} 
          placeholder={placeholder} />
      { invalid && 
        (<div className="required text-white text-center">{validationMessage}</div>) }
    </div>
  );
};

const DropDown = ({ label, value, valid, visited, options,
  onChange, onBlur, onFocus, validationMessage, }) => {
  const invalid = !valid && visited;
  const defaultClasses = "form-control-user form-select text-black"
  return (
    <div onBlur={onBlur} onFocus={onFocus}>
        <select
          className={invalid ? "invalid "+defaultClasses : ""+defaultClasses}
          value={value}
          onChange={onChange}>
          <option key=""></option>
          {options.map(option => (
            <option key={option}>{option}</option>
          ))}
        </select>
      { invalid && 
        (<div className="required">{validationMessage}</div>) }
    </div>
  )
}

const SearchSelector = ({ label, value, valid, visited, options,
  onChange, onBlur, onFocus, validationMessage, classNames }) => {
  const invalid = !valid && visited;
  return (
    <div onBlur={onBlur} onFocus={onFocus}>
        <MultiSelect
          className={classNames}
          data={options}
          onChange={onChange} 
          value={value} />
      { invalid && 
        (<div className="required">{validationMessage}</div>) }
    </div>
  )
}

const Checkbox = ({ label, visited, valid, onChange, value,
  validationMessage }) => {
  const onValueChange = React.useCallback(
    () => {
      onChange({ value: !value });
    },
    [onChange, value]
  );
  const invalid = !valid && visited;

  return (
    <div>
      <label>
        <input
          type="checkbox"
          className={invalid ? "invalid" : ""}
          onChange={onValueChange}
          value={value} />
        { label }
      </label>
      { invalid && 
        (<div className="required">{validationMessage}</div>) }
    </div>
  );
};

// takes the GameName and the setGameFilters from the KendoUI Form inside of WelcomeForm
const GameBox = ({ gameName, updateGame}) => {
  console.log(`${gameName}'s filters:`);
  let template = gameTemplates[gameName].filters;
  console.log("template: ", template);
  const [fields, setFields] = React.useState({});
  const setField = (f, val) => {
    let fieldCopy = JSON.parse(JSON.stringify(fields));
    fieldCopy[f] = val;
    setFields(fieldCopy);
  };
  const changeFunct = (e) => {
    return;
    // fields is used to just store the settings of this game.
    // updateFields is provided by the carrying WelcomeForm, which updates
    // the `games` [] with an updated version of this game. 
    console.log(e.name);
    setFields(Object.assign(fields, {}[e.name] = e.target.value));
    updateGame(gameName, fields);
  }

  return (
    <div class="col-sm-12 col-xl-12 align-self-center mb-3 mb-sm-0 splash-box py-4">
      <p class="text-white">{gameName}</p>
      {(() => {
        console.log("entries: ", Object.entries(template));
        Object.entries(template).map((arr, ind) => 
        (<div>
          <p>Okay cool! {arr[0]}</p>
        </div>)
          );
      })()}
      {(() => {
        Object.keys(template).map((field, i) => {
          console.log(`Building ${gameName}: adding splash-option for ${field}@${i}`);
          return (
          <div className="row splash-option" key={`GameBox option ${i}`}>
            <div className="col-sm-12 col-md-3 text-start align-self-center">
              <p className="w-100">{field} at index {i}</p>
            </div>
            <div className="col align-self-center">
              {/* `field` -- the current filter being rendered -- is passed as `name` */}
              {/* <input className="form-control" onChange={changeFunct} name={field} type="text" /> */}
            </div>
          </div>)
        })
      })()}
      <div className="row splash-option">
        <div className="col-sm-12 col-md-3 align-self-center">
          <p>THIS DID NOT WORK RIGHT, IF THIS IS FIRST</p>
        </div>
        <div className="col text-start align-self-center"><input className="form-control" type="text" /></div>
      </div>
    </div>
  )
}

const requiredValidator = (value) => {
  return value ? "" : "This field is required";
}

export default function WelcomeForm(props) {
  const [formStep, setFormStep] = React.useState(0);
  const completeFormStep = () => {
    setFormStep(cur => cur + 1);
  }
  const backpedalFormStep = () => {
      setFormStep(cur => cur - 1);
  }

  // will be set up like the `games` object in UserSchema. 
  const [gameFilters, setGameFilters] = React.useState([]);
  console.log("Default gameFilters: ", gameFilters);

  const handleSubmit = (data, event) => {

    console.log(`
      Username: ${data.username}
      Schools: ${data.schools}
      Gender: ${data.gender}
      Games: ${data.games}
      Accepted Terms: ${data.acceptedTerms}
      Game Filters: ${gameFilters}
    `);
    
    event.preventDefault();
  }

    // does setGameFilters with an updated version of gameFilters using filts in gameName.
  const updateGame = (name, filts) => {
    //todo
    let index = gameFilters.findIndex(e => { return (e.gameName == name) });
    setGameFilters(Object.assign(gameFilters[index].filters, filts));
  }

  return (
    <Form
      onSubmit={handleSubmit}
      initialValues={{
        username: "", acceptedTerms: false
      }}
      render={(formRenderProps) => (
        <form onSubmit={formRenderProps.onSubmit}>
          {formStep === 0 && (<div className="p-5 splash-section">
                <div className="text-center">
                    <h1 className="fw-bold text-white mb-4 splash-heading"><img className="rounded-circle" src={props.avatarURL} style={{marginRight: '30px'}} />Welcome {props.username}<span style={{color: 'gray'}}>#{props.tag}</span>!</h1>
                    </div>
                    <hr />
                <div className="row mb-3">
                    <div className="col-sm-12 col-xl-12 align-self-center mb-3 mb-sm-0 splash-box py-4">
                        <p className="text-white">On SquadUP, you can go by any username. Is this the one you'd like to use?</p>
                        <Field
                          name="username"
                          fieldType="text"
                          component={Input}
                          validator={[requiredValidator]} 
                          placeholder={`${props.username}`} 
                          value={`@${props.username}`} 
                          classNames="form-control form-control-user text-black"/>
                    </div>
                    <div className="col-sm-12 col-xl-12 align-self-center mb-3 mb-sm-0 splash-box py-4 mt-3">
                        <p className="text-white">Would you like to enter your school?</p>
                        <Field 
                          name="schools"
                          component={DropDown}
                          options={schools}/>
                    </div>
                    <div className="col-sm-12 col-xl-12 align-self-center mb-3 mb-sm-0 splash-box py-4 mt-3">
                        <p className="text-white">Would you like to enter your gender?</p>
                        <Field 
                          name="gender"
                          component={DropDown}
                          options={["Male", "Female", "Other"]}/>
                    </div>
                </div>
                <div className="mb-3"></div>
                <hr />
                <div class="row">
                <div class="col"></div>
                <div class="col text-end"><button class="btn btn-primary bg-gradient-primary" onClick={completeFormStep} type="button">Next &gt;</button></div>
                </div>
                
            </div>)}
          {formStep === 1 && (<div className="p-5 splash-section">
              <div className="text-center">
                  <h1 className="fw-bold text-white mb-4 splash-heading"><img className="rounded-circle" src={props.avatarURL} style={{marginRight: '30px'}} />Welcome {props.username}<span style={{color: 'gray'}}>#{props.tag}</span>!</h1>
                  </div>
                  <hr />
              <div className="row mb-3">
                  <div className="col-sm-12 col-xl-12 align-self-center mb-3 mb-sm-0 splash-box py-4">
                      <p className="text-white">What games do you play?</p>
                      <Field 
                          name="games"
                          options={games}
                          component={SearchSelector}
                          validator={[requiredValidator]} 
                          classNames="form-control form-control-user w-100" />
                  </div>
              </div>
              <div className="mb-3"></div>
              <hr />
              <div class="row">
              <div class="col"><button class="btn btn-primary fw-bold bg-gradient-danger" onClick={backpedalFormStep} type="button">&lt;&nbsp;Back</button></div>
              <div class="col text-end"><button class="btn btn-primary bg-gradient-primary" onClick={completeFormStep} type="button">Next &gt;</button></div>
              </div>
          </div>)}
          {formStep === 2 && (<div className="p-5 splash-section">
                <div className="text-center">
                    <h1 className="fw-bold text-white mb-4 splash-heading"><img className="rounded-circle" src={props.avatarURL} style={{marginRight: '30px'}} />Welcome {props.username}<span style={{color: 'gray'}}>#{props.tag}</span>!</h1>
                    </div>
                    <hr />
                <div className="row mb-3">
                    <div className="col-sm-12 col-xl-12 align-self-center mb-3 mb-sm-0 splash-box py-4">
                        <p className="text-white" style={{marginBottom: '0px'}}>What roles do you play for each game?</p>
                    </div>
                    {(() => {
                      const cGames = formRenderProps.valueGetter("games");
                      if (cGames != undefined && cGames.length > 0) {
                          return (
                          cGames.map((g, index) => (
                          <GameBox gameName={ g } updateGame={updateGame} index={index} />
                          )));
                      }
                      else {
                          return (<p class="away">no friends lol</p>);
                      }
                    })()}
                    
                </div>
                <div className="mb-3"></div>
                <hr />
                <div class="row">
                <div class="col"><button class="btn btn-primary fw-bold bg-gradient-danger" onClick={backpedalFormStep} type="button">&lt;&nbsp;Back</button></div>
                <div class="col text-end"><button class="btn btn-primary bg-gradient-primary" disabled={!formRenderProps.allowSubmit}>Submit!</button></div>
                </div>
            </div>)}
          
          <pre className="text-white">games: {JSON.stringify(formRenderProps.valueGetter("games"), null, 2)}</pre>
          <Field
            label=""
            name="email"
            fieldType="email"
            component={Input} />
          
          <Field
            label="Password:"
            name="password"
            fieldType="password"
            component={Input} />

          <Field 
            label="Country:"
            name="country"
            component={DropDown}
            options={countries} />

          <Field
            label="I accept the terms of service"
            name="acceptedTerms"
            component={Checkbox} />
        </form>
      )}>
    </Form>
  );
}


{/* <Field 
                          name="games"
                          options={games}
                          component={SearchSelector}
                          classNames="form-control form-control-user w100" /> */}