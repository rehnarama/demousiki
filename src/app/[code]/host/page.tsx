import { PlaybackState } from "@/app/components/PlaybackState";

interface PageProps {
  params: {
    code: string;
  };
}

export default function Page(props: PageProps) {
  return (
    <div>
      <p>Code: {props.params.code}</p>
      <PlaybackState />
    </div>
  );
}
