import React from "react";
import '../assets/stylesheets/modal.css';
import {findImg, getName} from '../assets/js/gameIcons';
import { MultiSelect } from "@progress/kendo-react-dropdowns";
import { gameTemplates } from "../assets/js/gameTemplates";

function GameModal(props) {
  let setGameModal = props.setGameModal; 
  let name = getName(props.gameID);
  let games = props.games;
  console.log(props);

  const GameBox = ({ gameName, finalCommand}) => {
    console.log(`${gameName}'s filters:`);
    const id = gameTemplates[gameName].gameID;
    let template = gameTemplates[gameName].filters;
    console.log("template: ", template);
  
    // fields is used to just store the settings of this game.
    // finalCommand is provided by the carrying WelcomeForm, which updates
    // the `games` [] with an updated version of this game. 
    const [fields, setFields] = React.useState({
  
    });
    const [gameSettings, setGameSettings] = React.useState({
      gameID: id,
      filters: {}
    });
  
    const setField = (f, val) => {
      console.log("setField called -- ", f, val);
      let tempField = {};
      tempField[f] = val;
      console.log("tempField: ", tempField);
      setFields(Object.assign(fields, tempField));
      console.log("fields: ", fields);
      // let fieldCopy = JSON.parse(JSON.stringify(fields));
      // fieldCopy[f] = val;
      // setFields(fieldCopy);
      // also update the game object. 
      setGameSettings(Object.assign(gameSettings, {filters: fields}));
      console.log("Just finished setField -- fields:", fields);
      console.log("Just finished setField -- gameSettings:", gameSettings);
    };
  
    return (
      <div class="col-sm-12 col-xl-12 align-self-center mb-3 mb-sm-0 splash-box py-4">
        <p class="text-white">{gameName}</p>
        {(() => {
          // For each filter we can be searched by, have the user input their opinions!
          return Object.keys(template).map((field, i) => {
            return (
            <div className="row splash-option" >
              <div className="col-sm-12 col-md-3 text-start align-self-center">
                <p className="w-100 text-capitalize">{field}</p>
              </div>
              <div className="col align-self-center">
                {/* `field` -- the current filter being rendered -- is passed as `name` when updating text in onChange*/}
                {(()=>{
                  let changeFunct = ((e) => {
                    console.log(`Setting ${e.target.name}: ${e.target.value}...`);
                    setField(e.target.name, e.target.value);
                    console.log(`Giving ${gameName} its settings:`, gameSettings);
                    finalCommand(gameName, gameSettings);
                  });
                  // see if template field is an iRange :) (ex: level: "i1-250")
                  if (typeof template[field] === 'string' || template[field] instanceof String) {
                    // ["i1", "250"]
                    let splits = template[field].split("-");
                    if (splits[0].charAt(0) == 'i') {
                      let lower = parseInt(splits[0].substr(1)); // 1
                      let upper = parseInt(splits[1]); // 250
                      if (!isNaN(lower) && !isNaN(upper)) {
                        return (
                          <div>
                            <input 
                              type="number"
                              name={field}
                              min={lower} max={upper}
                              onChange={changeFunct}
                              step="1"/>
                          </div>
                        );
                      }
                    }
                    // should never happen, but just in case!
                    return (
                      <input
                        className="form-control"
                        onChange={changeFunct}
                        name={field}
                        type="text" />
                    );
                  }
                  else
                    return (
                      <MultiSelect
                        name={field}
                        className="form-control form-control-user w-100"
                        data={template[field]}
                        onChange={changeFunct}/>
                    );
                })()}
              </div>
            </div>)
          })
        })()}
      </div>
    )
  }

  return (
    <div className="modalBackground text-white">
      <div className="modalContainer">
      <div className="modalContainer2">
        <div className="titleCloseBtn">
          <button className="text-white" onClick={() => { setGameModal(false);  }}> X </button>
        </div>
        <div className="title">
          <div className="title-border">
          <img className="img-modal" src={findImg(props.gameID)}/><span className="game-name">&nbsp;{name}</span>
          </div>
        </div>
        <div className="body">
        <div className="body-border">
        {(() => {
            if (games != undefined && games.length > 0) {
                return (
                games.map((game, index) => {
                  console.log("game: ", game);
                return (
                  <GameBox gameID={game.gameID} />
                )}));
            }
            else {
                return (<p class="away">Your Game Edits will be here.</p>);
            }
          })()}
        </div>
        </div>
        <div className="footer">
          <button onClick={() => { setGameModal(false);  }}>Cancel</button>
          <button id="cancelBtn" onClick={() => { setGameModal(false);  }}>Save Changes</button>
        </div>
      </div>
      </div>
    </div>
  );
}
  
  export default GameModal;