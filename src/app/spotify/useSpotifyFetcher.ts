import { useSession } from "next-auth/react";
import { useMemo } from "react";

export const useSpotifyFetcher = () => {
  const session = useSession();
  return useMemo(() => {
    return (path: string) =>
      fetch(`https://api.spotify.com/v1/${path}`, {
        headers: {
          Authorization: `Bearer ${session.data?.accessToken}`,
        },
      }).then((res) => res.json());
  }, [session.data?.accessToken]);
};
