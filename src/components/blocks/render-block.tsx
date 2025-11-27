import Image from 'next/image';
import Link from 'next/link';
import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Block } from '@/lib/data';
import { incrementClick } from '@/app/events/actions';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Linkedin } from 'lucide-react';

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
    const Container = ({ children, className }: { children: React.ReactNode; className?: string }) => {
        const styles = block.styles || {};
        const style: React.CSSProperties = {
            backgroundColor: styles.backgroundColor,
            color: styles.textColor,
            paddingTop: styles.padding === 'none' ? '0' : styles.padding === 'small' ? '1rem' : styles.padding === 'large' ? '4rem' : '2rem',
            paddingBottom: styles.padding === 'none' ? '0' : styles.padding === 'small' ? '1rem' : styles.padding === 'large' ? '4rem' : '2rem',
        };

        const fontSizeClass = {
            sm: 'text-sm',
            base: 'text-base',
            lg: 'text-lg',
            xl: 'text-xl',
        }[styles.fontSize as string] || '';

        return (
            <div style={style} className={cn("w-full", className)}>
                <div className={cn("container px-4 md:px-6 mx-auto max-w-4xl", fontSizeClass)}>
                    {children}
                </div>
            </div>
        );
    };

    switch (type) {
        case 'hero':
            const heroStyles = block.styles || {};
            const headlineStyle = heroStyles.headlineStyles || {};
            const subtextStyle = heroStyles.subtextStyles || {};
            const buttonStyle = heroStyles.buttonStyles || {};

            const heroPaddingClass = heroStyles.padding === 'none' ? 'py-0' : heroStyles.padding === 'small' ? 'py-12' : heroStyles.padding === 'large' ? 'py-32' : 'py-24';

            return (
                <section
                    {...commonProps}
                    style={{
                        backgroundColor: heroStyles.backgroundColor,
                        color: heroStyles.textColor
                    }}
                    className={cn("relative w-full min-h-[400px] flex items-center justify-center text-center text-white overflow-hidden", heroPaddingClass, commonProps.className)}
                >
                    {content.backgroundImageSrc ? (
                        <Image
                            src={content.backgroundImageSrc}
                            alt={content.headline || 'Hero background'}
                            fill
                            className="object-cover z-0 brightness-[0.4]"
                            priority
                            unoptimized // Add unoptimized to prevent issues with external images if domain not configured
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-purple-900/80 z-0" />
                    )}
                    <div className="space-y-6 p-4 max-w-3xl relative z-10">
                        <h1
                            className={cn("font-bold tracking-tighter drop-shadow-lg", {
                                'text-3xl md:text-4xl': headlineStyle.fontSize === '3xl',
                                'text-4xl md:text-6xl lg:text-7xl': !headlineStyle.fontSize || headlineStyle.fontSize === '4xl' || headlineStyle.fontSize === '5xl', // Default range
                                'text-6xl md:text-8xl': headlineStyle.fontSize === '6xl' || headlineStyle.fontSize === '7xl',
                            })}
                            style={{
                                color: headlineStyle.color,
                                fontSize: headlineStyle.fontSize && !['3xl', '4xl', '5xl', '6xl', '7xl'].includes(headlineStyle.fontSize) ? headlineStyle.fontSize : undefined
                            }}
                        >
                            {content.headline}
                        </h1>
                        <p
                            className={cn("text-white/90 drop-shadow-md", {
                                'text-base': subtextStyle.fontSize === 'base',
                                'text-lg md:text-xl/relaxed': !subtextStyle.fontSize || subtextStyle.fontSize === 'lg' || subtextStyle.fontSize === 'xl',
                                'text-2xl': subtextStyle.fontSize === '2xl',
                            })}
                            style={{
                                color: subtextStyle.color,
                                fontSize: subtextStyle.fontSize && !['base', 'lg', 'xl', '2xl'].includes(subtextStyle.fontSize) ? subtextStyle.fontSize : undefined
                            }}
                        >
                            {content.text}
                        </p>
                        {content.buttonText && (
                            content.action === 'form' ? (
                                <Button
                                    size={(content.buttonSize || 'lg') as ButtonProps['size']}
                                    variant={(content.buttonVariant || 'default') as ButtonProps['variant']}
                                    onClick={handleButtonClick}
                                    className={cn("pointer-events-auto shadow-xl hover:scale-105 transition-transform", {
                                        'text-sm px-4 py-2': buttonStyle.fontSize === 'sm',
                                        'text-base px-6 py-3': buttonStyle.fontSize === 'default',
                                        'text-lg px-8 py-6': !buttonStyle.fontSize || buttonStyle.fontSize === 'lg',
                                        'text-xl px-10 py-8': buttonStyle.fontSize === 'xl',
                                    })}
                                    style={{
                                        color: buttonStyle.color,
                                        backgroundColor: buttonStyle.backgroundColor,
                                        fontSize: buttonStyle.fontSize && !['sm', 'default', 'lg', 'xl'].includes(buttonStyle.fontSize) ? buttonStyle.fontSize : undefined
                                    }}
                                >
                                    {content.buttonText}
                                </Button>
                            ) : (
                                <Link href={content.href || '#'} target={isEditable ? undefined : "_blank"} onClick={isEditable ? (e) => e.preventDefault() : undefined}>
                                    <Button
                                        size={(content.buttonSize || 'lg') as ButtonProps['size']}
                                        variant={(content.buttonVariant || 'default') as ButtonProps['variant']}
                                        className={cn("pointer-events-auto shadow-xl hover:scale-105 transition-transform", {
                                            'text-sm px-4 py-2': buttonStyle.fontSize === 'sm',
                                            'text-base px-6 py-3': buttonStyle.fontSize === 'default',
                                            'text-lg px-8 py-6': !buttonStyle.fontSize || buttonStyle.fontSize === 'lg',
                                            'text-xl px-10 py-8': buttonStyle.fontSize === 'xl',
                                        })}
                                        style={{
                                            color: buttonStyle.color,
                                            backgroundColor: buttonStyle.backgroundColor,
                                            fontSize: buttonStyle.fontSize && !['sm', 'default', 'lg', 'xl'].includes(buttonStyle.fontSize) ? buttonStyle.fontSize : undefined
                                        }}
                                    >
                                        {content.buttonText}
                                    </Button>
                                </Link>
                            )
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

        case 'speaker':
            return (
                <Container>
                    <Card {...commonProps} className={cn("overflow-hidden", commonProps.className)}>
                        <div className="flex flex-col md:flex-row gap-6 p-6">
                            <div className="shrink-0">
                                <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-xl">
                                    <AvatarImage src={content.imageUrl} alt={content.name} className="object-cover" />
                                    <AvatarFallback>{content.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="space-y-4 flex-1">
                                <div>
                                    <h3 className="text-2xl font-bold">{content.name}</h3>
                                    <p className="text-primary font-medium">{content.role}</p>
                                </div>
                                <p className="text-muted-foreground leading-relaxed">{content.bio}</p>
                                {content.linkedinUrl && (
                                    <Link href={content.linkedinUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                        <Linkedin className="h-4 w-4" />
                                        LinkedIn Profile
                                    </Link>
                                )}
                            </div>
                        </div>
                    </Card>
                </Container>
            );

        case 'agenda':
            return (
                <Container>
                    <div {...commonProps} className={cn("space-y-8", commonProps.className)}>
                        {(content.items || []).map((item: any, index: number) => (
                            <div key={index} className="relative pl-8 md:pl-0">
                                <div className="md:flex gap-8 items-start group/item">
                                    <div className="hidden md:flex flex-col items-end w-32 shrink-0 pt-1">
                                        <span className="font-bold text-xl text-primary">{item.time}</span>
                                    </div>
                                    <div className="absolute left-0 top-2 md:left-[8.5rem] w-3 h-3 rounded-full bg-primary ring-4 ring-background" />
                                    <div className="hidden md:block absolute left-[8.85rem] top-5 bottom-[-2rem] w-px bg-border last:hidden" />

                                    <Card className="flex-1 mb-8 md:mb-0">
                                        <CardHeader>
                                            <div className="md:hidden mb-2">
                                                <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    {item.time}
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-xl">{item.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground">{item.description}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>
            );

        case 'faq':
            return (
                <Container>
                    <div {...commonProps} className={cn("max-w-2xl mx-auto", commonProps.className)}>
                        <Accordion type="single" collapsible className="w-full">
                            {(content.items || []).map((item: any, index: number) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                    <AccordionTrigger className="text-left text-lg font-medium">
                                        {item.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                                        {item.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </Container>
            );

        default:
            return null;
    }
}
