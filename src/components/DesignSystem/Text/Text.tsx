import './Text.css';

type TextVariant =
  | 'hero'
  | 'title'
  | 'heading'
  | 'subheading'
  | 'body'
  | 'caption'
  | 'overline';

interface TextProps {
  variant?: TextVariant;
  children: React.ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

const variantTags: Record<TextVariant, keyof React.JSX.IntrinsicElements> = {
  hero: 'h1',
  title: 'h2',
  heading: 'h3',
  subheading: 'h4',
  body: 'p',
  caption: 'span',
  overline: 'span',
};

export const Text = ({
  variant = 'body',
  children,
  className = '',
  as,
}: TextProps) => {
  const Tag = as ?? variantTags[variant];
  return (
    <Tag
      className={`ds-text ds-text--${variant} ${className}`}
      data-testid={`text-${variant}`}
    >
      {children}
    </Tag>
  );
};
