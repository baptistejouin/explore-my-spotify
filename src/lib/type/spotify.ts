type ExternalUrls = {
  spotify: string;
}

type ExternalIds = {
  isrc: string;
}

type Image = {
  height: number;
  url: string;
  width: number;
}

type Artist = {
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
  external_urls: {
    spotify: string;
  };
};

type Context = {
  href: string;
  type: string;
  uri: string;
  external_urls: ExternalUrls
}

type Album = {
  album_type: string;
  artists: Artist[];
  available_markets: string[];
  href: string;
  id: string;
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
  external_urls: ExternalUrls
  images: Image[];
};

export type Song = {
  album: Album;
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
  external_ids: ExternalIds;
  external_urls: ExternalUrls;
};

export type CurrentlyPlayingType = {
  timestamp: number;
  context: Context;
  progress_ms: number;
  item: Song;
  currently_playing_type: string;
  actions: {
    disallows: {
      resuming: boolean;
    };
  };
};

export type RecentlyPlayedType = {
  limit: number;
  total: number;
  items: {
    played_at: string;
    track: Song;  
  }[]
};
