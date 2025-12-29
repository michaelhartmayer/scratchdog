import { audioManager } from '../../../audio/AudioManager';
import './Button.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

export const Button = ({
  variant = 'primary',
  children,
  className = '',
  disabled,
  onClick,
  onMouseEnter,
  ...props
}: ButtonProps) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      void audioManager.playSFX('menu-select');
      onClick?.(e);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      void audioManager.playSFX('menu-switch');
      onMouseEnter?.(e);
    }
  };

  return (
    <button
      className={`ds-button ds-button--${variant} ${className}`}
      disabled={disabled}
      data-testid={disabled ? 'button-disabled' : `button-${variant}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      {children}
    </button>
  );
};
