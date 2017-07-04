// @flow

export interface Torrent {
  title?: string,
  name?: string,
  url: string,
  id: string,
  image?: string,
  category?: string
}

export interface History {
  push: (string) => void,
  goBack: () => void
}
