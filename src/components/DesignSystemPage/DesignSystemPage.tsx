import { Button, GlassPanel, Text, MenuItem } from '../DesignSystem';
import './DesignSystemPage.css';

export const DesignSystemPage = () => {
    return (
        <div className="design-system-page">
            <Text variant="title">Design System</Text>

            <section>
                <Text variant="heading">Typography</Text>
                <Text variant="hero">Hero Text</Text>
                <Text variant="title">Title Text</Text>
                <Text variant="heading">Heading Text</Text>
                <Text variant="subheading">Subheading Text</Text>
                <Text variant="body">Body Text</Text>
                <Text variant="caption">Caption Text</Text>
                <Text variant="overline">Overline Text</Text>
            </section>

            <section>
                <Text variant="heading">Buttons</Text>
                <div className="button-row">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="primary" disabled>Disabled</Button>
                </div>
            </section>

            <section>
                <Text variant="heading">Glass Panel</Text>
                <GlassPanel>
                    <Text variant="body">This is a glass panel with default padding.</Text>
                </GlassPanel>
            </section>

            <section>
                <Text variant="heading">Menu Items</Text>
                <div className="menu-items">
                    <MenuItem>Menu Item 1</MenuItem>
                    <MenuItem>Menu Item 2</MenuItem>
                    <MenuItem disabled>Disabled Item</MenuItem>
                </div>
            </section>
        </div>
    );
};
