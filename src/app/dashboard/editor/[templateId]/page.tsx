
import { getEventById } from '@/lib/data';
import { Editor } from './editor';
import { notFound } from 'next/navigation';

export default async function EditorPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;
  const event = await getEventById(templateId);

  if (!event) {
    notFound();
  }

  return <Editor event={event} />;
}
