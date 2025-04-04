import { PlaybackState } from "@/app/components/PlaybackState";

interface PageProps {
  params: Promise<{
    code: string;
  }>;
}

export default function Page(props: PageProps) {
  const params = await props.params;
  return (
    <div>
      <p>Code: {params.code}</p>
      <PlaybackState />
    </div>
  );
}
