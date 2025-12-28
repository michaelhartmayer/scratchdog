import './GlassPanel.css';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const GlassPanel = ({
  children,
  className = '',
  padding = 'md',
}: GlassPanelProps) => {
  return (
    <div
      className={`ds-glass-panel ds-glass-panel--padding-${padding} ${className}`}
      data-testid="glass-panel"
    >
      {children}
    </div>
  );
};
