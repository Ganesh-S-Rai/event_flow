
import { Editor } from './editor';

export default function EditorPage({
  params,
}: {
  params: { templateId: string };
}) {

  return <Editor templateId={params.templateId} />;
}
