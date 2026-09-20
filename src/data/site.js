// ✏️ Edit this file to change the words on your site.
// The three "music player" windows on the About page come from `tracks`.

export const site = {
  name: 'Maryam',
  tagline: 'digital art + animation',
  url: 'maryam.art', // only shown in the fake browser address bar
  mood: 'sleepy but still drawing',
  nowPlaying: 'lo-fi beats to draw to',
  tubeLogo: ['Toon', 'Tube'],


  tracks: [
    {
      file: 'hello.mp3',
      title: "hi, i'm Maryam",
      sprite: 'heart', // heart | star | flower  (or set image: 'https://...' to use your own)
      bg: '#7ad9c8',
      seconds: 206,
      start: 7,
      fields: [
        { label: 'Artist', value: 'Maryam' },
        { label: 'Makes', value: 'digital art + short animations' },
        { label: 'Vibe', value: 'soft, weird, a little glitchy' },
      ],
    },
    {
      file: 'the-work.mp3',
      title: "what's in here",
      sprite: 'flower',
      bg: '#b58cff',
      seconds: 243,
      start: 70,
      fields: [
        { label: 'Stills', value: 'paintings + drawings, all digital' },
        { label: 'Animation', value: 'loops, shorts, tiny stories' },
        { label: 'Tools', value: 'a tablet and a lot of layers' },
      ],
    },
    {
      file: 'why.mp3',
      title: 'why i made this',
      sprite: 'star',
      bg: '#ff9fc9',
      seconds: 224,
      start: 147,
      fields: [
        {
          label: 'The note',
          long: true,
          value:
            'I wanted my art to have a home of its own. Everything here is drawn and animated by me, and it keeps growing.',
        },
        { label: 'New stuff', value: "added when it's finished, not perfect" },
      ],
    },
  ],
};
