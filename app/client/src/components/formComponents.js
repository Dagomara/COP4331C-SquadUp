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