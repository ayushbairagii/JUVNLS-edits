/*
  VIDEO SLOTS
  -----------
  Compressed copies live in /videos (720p, ~2.5 Mbps, with a matching .jpg poster).
  Each slot takes a path like "videos/dean1.mp4" (or any .mp4 URL, or a Google Drive link).
  Hero reel + small cards loop muted while on screen; click a card for sound.
  Grid cards play on hover (desktop) or tap, with sound.
  To reorder: swap the paths between slots. work-1 is the top-left card.
*/
window.VIDEOS = {
  // Hero reel (scrolling row at the top)
  'hero-1': 'videos/dean1.mp4', // Dean_1
  'hero-2': 'videos/stackai.mp4', // StackAI_3
  'hero-3': 'videos/dean2.mp4', // Dean_2
  'hero-4': 'videos/clip04.mp4', // Clip04_Ourselves
  'hero-5': 'videos/clip08.mp4', // Clip 08

  // Client work grid (8 cards, row by row)
  'work-1': 'videos/dean1.mp4', // Dean_1
  'work-2': 'videos/stackai.mp4', // StackAI_3
  'work-3': 'videos/clip06.mp4', // Clip 06_Ourselves
  'work-4': 'videos/ourselves7.mp4', // Ourselves7_Vertical
  'work-5': 'videos/clip08.mp4', // Clip 08
  'work-6': 'videos/dean6.mp4', // Dean_6
  'work-7': 'videos/marathon.mp4', // better_marathon_1
  'work-8': 'videos/v3seb.mp4', // v3Seb_Vertical

  // FAQ side card
  'faq': 'videos/ourselves7.mp4', // Ourselves7_Vertical

  // Contact section, three small cards (thumbnail only)
  'contact-story': 'videos/v3seb.mp4', // v3Seb_Vertical
  'contact-pace': 'videos/dean6.mp4', // Dean_6
  'contact-motion': 'videos/stackai.mp4', // StackAI_3
};

// Override the poster image for any slot (optional)
window.POSTERS = {
  // 'work-1': 'assets/my-poster.jpg'
};
