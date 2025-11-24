import { RenderBlock } from '@/components/blocks/render-block';
import type { Block } from '@/lib/data';
import { cn } from '@/lib/utils';

interface EditorCanvasProps {
    blocks: Block[];
    selectedBlockId: string | null;
    onSelectBlock: (id: string | null) => void;
}

export function EditorCanvas({ blocks, selectedBlockId, onSelectBlock }: EditorCanvasProps) {
    return (
        <div
            className="min-h-full"
            onClick={() => onSelectBlock(null)} // Deselect when clicking background
        >
            <div className="flex flex-col">
                {blocks.map(block => (
                    <div
                        key={block.id}
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelectBlock(block.id);
                        }}
                        className={cn(
                            "relative transition-all duration-200 pointer-events-auto group",
                            selectedBlockId === block.id ? "ring-2 ring-primary ring-inset z-10" : "hover:ring-1 hover:ring-primary/50 hover:z-10"
                        )}
                    >
                        <RenderBlock block={block} isEditable={true} />
                    </div>
                ))}

                {blocks.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-lg m-8">
                        <p>No blocks yet. Add one from the sidebar!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
