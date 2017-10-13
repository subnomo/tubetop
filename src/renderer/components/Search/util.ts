export function isYoutubeLink(url: string) {
  const youtubeExps = [
    /https?:\/\/www\.youtube\.com\/watch\?v=([\w-]+)(\&t=\d*m?\d*s?)?/,
    /https?:\/\/youtube\.com\/watch\?v=([\w-]+)(\&t=\d*m?\d*s?)?/,
    /https?:\/\/youtu.be\/([\w-]+)(\?t=\d*m?\d*s?)?/,
    /https?:\/\/youtube.com\/v\/([\w-]+)(\?t=\d*m?\d*s?)?/,
    /https?:\/\/www.youtube.com\/v\/([\w-]+)(\?t=\d*m?\d*s?)?/
  ];

  for (let i = 0; i < youtubeExps.length; i++) {
    if (youtubeExps[i].test(url)) return true;
  }

  return false;
}

export function isYoutubePlayList(url: string) {
  const youtubePlaylistExp = /https?:\/\/www\.youtube\.com\/playlist\?list=([\w-]+)/;
  return youtubePlaylistExp.test(url);
}
