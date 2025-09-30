export default function EditorPage({ params }: { params: { templateId: string } }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Landing Page Editor</h2>
        <p className="text-muted-foreground">
          Editing template: {params.templateId}
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
            <p>Form controls will go here.</p>
        </div>
        <div>
            <p>Live preview will go here.</p>
        </div>
      </div>
    </div>
  );
}
