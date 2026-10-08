/*
  VIDEO SLOTS
  -----------
  Each slot takes a Google Drive share link ("https://drive.google.com/file/d/<id>/view")
  or a direct video URL / file path (.mp4 / .webm). Empty = poster only.

  Drive links: the card shows Drive's own thumbnail; clicking it opens Drive's
  player inside the card. Direct .mp4 URLs instead autoplay muted on hover.
  Make sure each Drive file is shared as "Anyone with the link".

  To reorder: just swap the links between slots. work-1 is the top-left card.
*/
window.VIDEOS = {
  // Hero reel (scrolling row at the top)
  'hero-1': 'https://drive.google.com/file/d/140K5iDDpIKjWE-DJPeTEo1Np1lJ1CsDu/view', // Dean_1
  'hero-2': 'https://drive.google.com/file/d/1TvatewwfV4s6HsjdiVK3nOGj1Vsstwsh/view', // StackAI_3
  'hero-3': 'https://drive.google.com/file/d/1bS4o9rr1bA9uokkan6PTQl3H3sxzWx5q/view', // Dean_2
  'hero-4': 'https://drive.google.com/file/d/1m0d0qBJp4O00VRkfj_dd1qkE7h-NFnVb/view', // Clip04_Ourselves
  'hero-5': 'https://drive.google.com/file/d/1pXfz-G__uZS79A3R4r77nsga7HMeoH7z/view', // Clip 08

  // Client work grid (8 cards, row by row)
  'work-1': 'https://drive.google.com/file/d/140K5iDDpIKjWE-DJPeTEo1Np1lJ1CsDu/view', // Dean_1
  'work-2': 'https://drive.google.com/file/d/1TvatewwfV4s6HsjdiVK3nOGj1Vsstwsh/view', // StackAI_3
  'work-3': 'https://drive.google.com/file/d/1q16eUuD784M13Igb0CFfE2VWRaoX3B6w/view', // Clip 06_Ourselves
  'work-4': 'https://drive.google.com/file/d/1J223Usr9Y6O79ZiTDtYlzoOQrTik0YEY/view', // Ourselves7_Vertical
  'work-5': 'https://drive.google.com/file/d/1pXfz-G__uZS79A3R4r77nsga7HMeoH7z/view', // Clip 08
  'work-6': 'https://drive.google.com/file/d/1Ci5q7IKOCjes_6ejjyhFM96GBW2H7p55/view', // Dean_6
  'work-7': 'https://drive.google.com/file/d/1Nx74sCxZk5yvDIBTWQquyGanl5c4szQ5/view', // better_marathon_1
  'work-8': 'https://drive.google.com/file/d/1J2X74hv33U1RH7OBKfYGnxvO-GdGdJPS/view', // v3Seb_Vertical

  // FAQ side card
  'faq': 'https://drive.google.com/file/d/1J223Usr9Y6O79ZiTDtYlzoOQrTik0YEY/view', // Ourselves7_Vertical

  // Contact section, three small cards (thumbnail only)
  'contact-story': 'https://drive.google.com/file/d/1J2X74hv33U1RH7OBKfYGnxvO-GdGdJPS/view', // v3Seb_Vertical
  'contact-pace': 'https://drive.google.com/file/d/1Ci5q7IKOCjes_6ejjyhFM96GBW2H7p55/view', // Dean_6
  'contact-motion': 'https://drive.google.com/file/d/1TvatewwfV4s6HsjdiVK3nOGj1Vsstwsh/view', // StackAI_3
};

// Override the poster image for any slot (optional)
window.POSTERS = {
  // 'work-1': 'assets/my-poster.jpg'
};
