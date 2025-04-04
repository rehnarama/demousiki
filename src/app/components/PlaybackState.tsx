"use client";

import { useSpotifyPlaybackState } from "../spotify/useSpotifyApi";
import { Card, CardBody, Image, Slider } from "@heroui/react";
import { useSpotifyContext } from "../spotify/useSpotifyContext";
import { timeToString } from "../utils/timeUtils";

const isTrackObject = (
  value?: SpotifyApi.CurrentlyPlayingObject["item"]
): value is SpotifyApi.TrackObjectFull => {
  return value?.type === "track";
};

export const PlaybackState = () => {
  const { data: playbackState } = useSpotifyPlaybackState();
  const context = useSpotifyContext(playbackState?.context);

  const playItem = playbackState?.item;

  const progress = playbackState?.progress_ms ?? 0;
  const duration = playItem?.duration_ms ?? 1;

  return (
    <div>
      <Card
        isBlurred
        className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
        shadow="sm"
      >
        <CardBody>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
            <div className="relative col-span-6 md:col-span-4">
              <Image
                alt="Album cover"
                className="object-cover aspect-square"
                width={200}
                shadow="md"
                src={
                  isTrackObject(playItem)
                    ? playItem.album.images[0]?.url
                    : undefined
                }
              />
            </div>

            <div className="flex flex-col col-span-6 md:col-span-8">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-0">
                  <h3 className="font-semibold text-foreground/90">
                    {context?.name}
                  </h3>
                  <p className="text-small text-foreground/80">
                    {context && `${context.count} Tracks`}
                  </p>
                  <h1 className="text-medium mt-2 font-bold">
                    {playItem?.name}
                  </h1>
                  {isTrackObject(playItem) ? (
                    <p className="text-small text-foreground/80">
                      {playItem.artists[0]?.name}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col mt-3 gap-1">
                <Slider
                  aria-label="Music progress"
                  classNames={{
                    track: "bg-default-500/30",
                    thumb: "w-2 h-2 after:w-2 after:h-2 after:bg-foreground",
                  }}
                  color="foreground"
                  value={Math.round((progress / duration) * 100)}
                  size="sm"
                />
                <div className="flex justify-between">
                  <p className="text-small">{timeToString(progress)}</p>
                  <p className="text-small text-foreground/50">
                    {timeToString(duration)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
