import useSWR from "swr";
import { useSpotifyFetcher } from "./useSpotifyFetcher";

type PathParameters<
  S extends string,
  Counter extends unknown[] = []
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
> = S extends `${infer _Prefix}{${infer Param}}${infer Rest}`
  ? Param extends ""
    ? { [K in `param${Counter["length"]}`]: string } & PathParameters<
        Rest,
        [...Counter, unknown]
      >
    : { [K in Param]: string } & PathParameters<Rest, Counter>
  : // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    {};

const genereateSpotifyApiHook =
  <Request extends object, Response>() =>
  <Path extends string>(path: Path) => {
    function useApi(
      request?: Request,
      args?: PathParameters<Path>,
      opts?: {
        paused?: boolean;
      }
    ): ReturnType<typeof useSWR<Response>> {
      const fetcher = useSpotifyFetcher();
      const params = new URLSearchParams();
      if (request) {
        for (const [key, value] of Object.entries(request)) {
          params.set(key, value);
        }
      }

      let replacedPath: string = path;
      if (args) {
        const argEntries = Object.entries(args);
        const positionalEntries = argEntries
          .filter(([key]) => !path.includes(key))
          .toSorted();
        const namedEntries = argEntries.filter(([key]) => path.includes(key));
        for (const [, value] of positionalEntries) {
          replacedPath = replacedPath.replace(`{}`, value);
        }
        for (const [key, value] of namedEntries) {
          replacedPath = replacedPath.replace(`{${key}}`, value);
        }
      }

      return useSWR<Response>(
        opts?.paused ? null : `${replacedPath}?${params.toString()}`,
        fetcher
      );
    }
    return useApi;
  };

export const useSpotifySearch = genereateSpotifyApiHook<
  SpotifyApi.SearchForItemParameterObject,
  SpotifyApi.SearchResponse
>()("search");

export interface CurrentPlaybackParameterObject {
  market?: string;
  additional_types?: string;
}
export const useSpotifyPlaybackState = genereateSpotifyApiHook<
  CurrentPlaybackParameterObject,
  SpotifyApi.CurrentPlaybackResponse | undefined
>()("me/player");

export interface GetPlaylistParameterObject {
  fields?: string;
}
export const useSpotifyGetPlaylist = genereateSpotifyApiHook<
  GetPlaylistParameterObject,
  SpotifyApi.PlaylistObjectFull
>()("playlists/{playlistId}");
