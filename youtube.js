import { YoutubeTranscript } from 'youtube-transcript';

const config = {
    lang: 'en',
    country: 'EN'
  };

YoutubeTranscript.fetchTranscript('zNVQfWC_evg', config).then(console.log);