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
    ...props
}: ButtonProps) => {
    return (
        <button
            className={`ds-button ds-button--${variant} ${className}`}
            disabled={disabled}
            data-testid={disabled ? 'button-disabled' : `button-${variant}`}
            {...props}
        >
            {children}
        </button>
    );
};
