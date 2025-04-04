import { useSpotifyGetPlaylist } from "./useSpotifyApi";

export const useSpotifyContext = (
  context?: SpotifyApi.CurrentPlaybackResponse["context"]
) => {
  const { data: playlist } = useSpotifyGetPlaylist(
    {},
    context?.uri ? { playlistId: context.uri.split(":")[2] } : undefined,
    {
      paused: context?.type !== "playlist",
    }
  );

  return context
    ? {
        name: playlist?.name,
        count: playlist?.tracks?.total,
      }
    : undefined;
};
