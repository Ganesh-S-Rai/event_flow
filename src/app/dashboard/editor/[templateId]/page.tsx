
import { getEventById } from '@/lib/data';
import { Editor } from './editor';
import { notFound } from 'next/navigation';

export default async function EditorPage({
  params,
}: {
  params: { templateId: string };
}) {
  const event = await getEventById(params.templateId);

  if (!event) {
    notFound();
  }

  return <Editor event={event} />;
}
