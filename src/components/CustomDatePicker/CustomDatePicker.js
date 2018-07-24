import React from 'react';
import { DatePicker } from 'material-ui-pickers';
import './CustomDatePicker.css';

const CustomDatePicker = ({ id, className, label, disableFuture, disablePast, shouldDisableDate, value, onChange }) => {
  return (
    <DatePicker
      id={id}
      className={`custom-date-picker ${className}`}
      keyboard
      label={label}
      format="YYYY/MM/DD"
      disableFuture={disableFuture}
      disablePast={disablePast}
      shouldDisableDate={date => {
        if (date.day() === 0 || date.day() === 6) {
          return true;
        }
        return false;
      }}
      mask={value =>
        value
          ? [
              /\d/,
              /\d/,
              /\d/,
              /\d/,
              '/',
              /\d/,
              /\d/,
              '/',
              /\d/,
              /\d/
            ]
          : []
      }
      value={value}
      onChange={onChange}
      disableOpenOnEnter
      animateYearScrolling={false}
    />
  )
};

export default CustomDatePicker;
