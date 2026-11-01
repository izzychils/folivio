import { CvEditor } from "@/components/studio/editor";

export default async function StudioEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CvEditor cvId={id} />;
}
