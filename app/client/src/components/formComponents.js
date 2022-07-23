import React from 'react';
import { MultiSelect } from "@progress/kendo-react-dropdowns";

export function DropDown({ label, value, valid, visited, options, onChange, onBlur, onFocus, validationMessage}) {
    const invalid = !valid && visited;
    const defaultClasses = "form-control-user form-select text-black";
    return (
        <div onBlur={onBlur} onFocus={onFocus}>
            <select
                className={invalid ? "invalid " + defaultClasses : "" + defaultClasses}
                value={value}
                onChange={onChange}>
                <option key=""></option>
                {options.map(option => (
                    <option key={option}>{option}</option>
                ))}
            </select>
            {invalid &&
                (<div className="required">{validationMessage}</div>)}
        </div>
    );
};


export function Input(fieldProps) {
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

export function SearchSelector({ label, value, valid, visited, options,
onChange, onBlur, onFocus, validationMessage, classNames }) {
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
  
export function Checkbox({ label, visited, valid, onChange, value,
validationMessage }) {
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

// for choosing # players to queue with :) 
export function PlayerSlider({ classes, label, onChange, value, ...sliderProps }) {
    //set initial value to 0 this will change inside useEffect in first render also| or you can directly set useState(value)
    const [sliderVal, setSliderVal] = React.useState(0);

    // keep mouse state to determine whether i should call parent onChange or not.
    // so basically after dragging the slider and then release the mouse then we will call the parent onChange, otherwise parent function will get call each and every change
    const [mouseState, setMouseState] = React.useState(null);

    React.useEffect(() => {
    setSliderVal(value); // set new value when value gets changed, even when first render
    }, [value]);

    const changeCallback = (e) => {
    setSliderVal(e.target.value); // update local state of the value when changing
    }

    React.useEffect(() => {
    if (mouseState === "up") {
        onChange(sliderVal)// when mouse is up then call the parent onChange
    }
    }, [mouseState])

    return (
    <div className="range-slider">
        <p>{label}</p>
        <h3>value: { sliderVal }</h3>
        <input
        type="range"
        value={sliderVal}
        {...sliderProps}
        className={`slider ${classes}`}
        id="myRange"
        onChange={changeCallback}
        onMouseDown={() => setMouseState("down")} // When mouse down set the mouseState to 'down'
        onMouseUp={() => setMouseState("up")} // When mouse down set the mouseState to 'up' | now we can call the parent onChnage
        />
    </div>
    );
  };
