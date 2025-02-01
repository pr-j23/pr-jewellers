import classNames from "classnames";
import React from "react";

function Button({
  label,
  isDisabled = false,
  onClick,
  classN = "",
  buttonType = "button",
}) {
  return (
    <button
      type={buttonType}
      className={classNames(
        isDisabled && "opacity-50 cursor-not-allowed",
        classN
      )}
      onClick={() => onClick?.()}
      disabled={isDisabled}
    >
      {label}
    </button>
  );
}

export default Button;
