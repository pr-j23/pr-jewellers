import classNames from 'classnames';
import type { ReactNode } from 'react';

export type ButtonProps = {
  label: ReactNode;
  isDisabled?: boolean;
  onClick?: () => void;
  classN?: string;
  buttonType?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
};

const Button = ({
  label,
  isDisabled = false,
  onClick,
  classN = '',
  buttonType = 'button',
  ariaLabel,
}: ButtonProps) => {
  return (
    <button
      type={buttonType}
      className={classNames(isDisabled && 'opacity-50 cursor-not-allowed', classN)}
      aria-label={ariaLabel}
      onClick={() => onClick?.()}
      disabled={isDisabled}
    >
      {label}
    </button>
  );
};

export default Button;
