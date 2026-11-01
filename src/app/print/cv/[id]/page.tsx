import { PrintView } from "@/components/cv/print-view";

export default async function PrintCvPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PrintView cvId={id} />;
}
