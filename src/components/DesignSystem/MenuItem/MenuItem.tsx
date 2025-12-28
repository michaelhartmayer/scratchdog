import './MenuItem.css';

interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export const MenuItem = ({
    children,
    className = '',
    disabled,
    ...props
}: MenuItemProps) => {
    return (
        <button
            className={`ds-menu-item ${className}`}
            disabled={disabled}
            data-testid={disabled ? 'menu-item-disabled' : 'menu-item'}
            {...props}
        >
            {children}
        </button>
    );
};
