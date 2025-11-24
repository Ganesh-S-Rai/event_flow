import Image from 'next/image';
import Link from 'next/link';
import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Block } from '@/lib/data';
import { incrementClick } from '@/app/events/actions';

export function RenderBlock({ block, onButtonClick, eventId, isEditable = false, onClick }: { block: Block; onButtonClick?: () => void; eventId?: string; isEditable?: boolean; onClick?: () => void }) {
    const { type, content } = block;
    const alignment = content.alignment || 'left';

    const handleButtonClick = (e: React.MouseEvent) => {
        if (isEditable) {
            e.preventDefault(); // Prevent action in edit mode
            return;
        }
        if (eventId) {
            incrementClick(eventId);
        }
        onButtonClick?.();
    }

    const alignmentClass = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
    }[alignment as 'left' | 'center' | 'right'] || 'text-left';

    const commonProps = {
        onClick: isEditable ? onClick : undefined,
        className: cn("relative group", isEditable && "cursor-pointer")
    };

    // Helper to wrap content in a container if it's not a full-width block like Hero
    const Container = ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <div className={cn("container px-4 md:px-6 py-6 mx-auto max-w-4xl", className)}>
            {children}
        </div>
    );

    switch (type) {
        case 'hero':
            return (
                <section {...commonProps} className={cn("relative w-full h-[60vh] min-h-[400px] flex items-center justify-center text-center text-white overflow-hidden", commonProps.className)}>
                    {content.backgroundImageSrc ? (
                        <Image src={content.backgroundImageSrc} alt={content.headline || 'Hero background'} fill className="object-cover -z-10 brightness-[0.4]" priority />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-purple-900/80 -z-10" />
                    )}
                    <div className="space-y-6 p-4 max-w-3xl relative z-10">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter drop-shadow-lg">{content.headline}</h1>
                        <p className="text-lg md:text-xl/relaxed text-white/90 drop-shadow-md">{content.text}</p>
                        {content.buttonText && (
                            <Button
                                size={content.buttonSize || 'lg'}
                                variant={content.buttonVariant || 'default'}
                                onClick={handleButtonClick}
                                className="pointer-events-auto text-lg px-8 py-6 shadow-xl hover:scale-105 transition-transform"
                            >
                                {content.buttonText}
                            </Button>
                        )}
                    </div>
                </section>
            )
        case 'heading':
            const Tag = (content.level || 'h2') as 'h1' | 'h2' | 'h3';
            const sizeClass = {
                h1: 'text-4xl md:text-5xl font-bold tracking-tight mb-4',
                h2: 'text-3xl md:text-4xl font-bold tracking-tight mb-4',
                h3: 'text-2xl md:text-3xl font-bold tracking-tight mb-3',
            }[Tag] || 'text-2xl font-bold';

            return (
                <Container>
                    <Tag {...commonProps} className={cn(sizeClass, alignmentClass, commonProps.className, "text-foreground")}>
                        {content.text}
                    </Tag>
                </Container>
            );

        case 'text':
            return (
                <Container>
                    <p {...commonProps} className={cn("text-muted-foreground text-lg leading-relaxed", alignmentClass, commonProps.className)}>
                        {content.text}
                    </p>
                </Container>
            );

        case 'image':
            return (
                <Container>
                    <div {...commonProps} className={cn("relative aspect-video w-full rounded-xl overflow-hidden shadow-lg border bg-muted", commonProps.className)}>
                        {content.src ? (
                            <Image src={content.src} alt={content.alt || 'Event image'} fill className="object-cover hover:scale-105 transition-transform duration-700" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">No Image Selected</div>
                        )}
                    </div>
                </Container>
            );

        case 'button':
            const button = (
                <Button
                    size={(content.size || 'default') as ButtonProps['size']}
                    variant={(content.variant || 'default') as ButtonProps['variant']}
                    className="pointer-events-auto"
                    onClick={handleButtonClick}
                >
                    {content.text}
                </Button>
            );

            return (
                <Container className="py-4">
                    <div {...commonProps} className={cn({
                        'text-left': content.alignment === 'left',
                        'text-center': content.alignment === 'center',
                        'text-right': content.alignment === 'right',
                    }, commonProps.className)}>
                        {content.href && !isEditable ? (
                            <Link href={content.href} target="_blank" rel="noopener noreferrer">
                                {button}
                            </Link>
                        ) : (
                            button
                        )}
                    </div>
                </Container>
            );

        default:
            return null;
    }
}
