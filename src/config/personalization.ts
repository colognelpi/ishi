/**
 * PERSONALIZATION CONFIGURATION
 * Edit any name, message, invitation ID, music URL, photo, or caption here
 * without touching the application logic.
 */

export interface MemoryPhotoItem {
  id: string;
  imageUrl: string;
  caption: string;
  dateLabel: string;
  /** Optional SVG keepsake theme key used when imageUrl is empty or SVG fallback is needed */
  keepsakeArt?: 'late-call' | 'playlist' | 'arcade-ticket' | 'rainy-walk';
}

export interface PersonalizationConfig {
  creatorName: string;
  recipientName: string;
  websiteTitle: string;
  invitationId: string;
  copy: {
    openingSubtitle: string;
    arcadeWelcome: string;
    catchHeartWin: string;
    memoryLaneWin: string;
    galleryIntro: string;
    confessionIntro: string;
    confessionSubtitle: string;
    confessionQuestion: string;
    yesButtonLabel: string;
    noButtonLabel: string;
    yesConfirmationTitle: string;
    yesConfirmationBody: string;
    yesNextButton: string;
    noConfirmationBody: string;
    loveLetterTitle: string;
    loveLetterBody: string;
    loveLetterSignature: string;
  };
  noButtonTeases: string[];
  memoryPairs: MemoryPhotoItem[];
  galleryPhotos: MemoryPhotoItem[];
}

export const PERSONALIZATION: PersonalizationConfig = {
  creatorName: 'Ishaac',
  recipientName: 'Irish',
  websiteTitle: 'A Little Something for You.',
  invitationId: 'INV-ISHAAC-IRISH-001',
  copy: {
    openingSubtitle: 'Hey Irish, I made something just for you.',
    arcadeWelcome: 'Welcome to our little world, Irish.',
    catchHeartWin: 'You collected all my hearts!',
    memoryLaneWin: 'Turns out, my favorite memories are the ones with you.',
    galleryIntro: 'A few little moments, a lot of feelings.',
    confessionIntro: "Irish, there's something I've been wanting to tell you...",
    confessionSubtitle: "I've been meaning to tell you this for a while.",
    confessionQuestion: 'Irish, would you like to be mine?',
    yesButtonLabel: 'YES, OF COURSE!',
    noButtonLabel: 'NO, NOT YET',
    yesConfirmationTitle: 'YOU JUST MADE ISHAAC THE HAPPIEST PERSON!',
    yesConfirmationBody:
      "I don't know what the future holds, but I know I'd love to make more memories with you. Thank you for giving me a chance.",
    yesNextButton: 'One More Thing...',
    noConfirmationBody:
      'Thank you for being honest with me, Irish. Your answer means a lot, and I respect how you feel.',
    loveLetterTitle: 'A Letter for You',
    loveLetterBody: `To Irish,

I don't really know when it started, but somewhere along the way, you became someone I genuinely look forward to talking to.

I made this little website because I wanted to do something different. Something that could hold a little piece of how I feel.

I don't promise that everything will always be perfect, but I would love to get to know you more, make memories with you, and see where this little story takes us.

Thank you for being here.`,
    loveLetterSignature: 'With love, Ishaac.',
  },
  noButtonTeases: [
    'Are you sure? :(',
    'Wait, think again!',
    'Wrong button, sweetheart.',
    'I think you meant YES.',
  ],
  memoryPairs: [
    {
      id: 'pair-1',
      imageUrl: '/assets/aistudio/b281b2a7451ef52f023c1c926943a376_10872624.jpg',
      caption: 'Cute stickers & my favorite smile',
      dateLabel: 'Memory 01',
    },
    {
      id: 'pair-2',
      imageUrl: '/assets/aistudio/2005fd6b81cce23998ab5bad1e45362a_4f9caeb5.jpg',
      caption: 'Little mirror snapshots & laughs',
      dateLabel: 'Memory 02',
    },
    {
      id: 'pair-3',
      imageUrl: '/assets/aistudio/a60ffef6d1185fa9d58fbc64e86ec0cc_501988a5.jpg',
      caption: 'Sharing one song in the quiet night',
      dateLabel: 'Memory 03',
    },
    {
      id: 'pair-4',
      imageUrl: '/assets/aistudio/724f9d1bf7d1f20ac82d62ad24e2c221_f093b874.jpg',
      caption: 'Peeking over books on our trip',
      dateLabel: 'Memory 04',
    },
    {
      id: 'pair-5',
      imageUrl: '/assets/aistudio/78343a2482a1ea12f3dceeee3ab46fab_022a9390.jpg',
      caption: 'Sweet cake & birthday memories',
      dateLabel: 'Memory 05',
    },
    {
      id: 'pair-6',
      imageUrl: '/assets/aistudio/25d5f6bfadcaa437596eabb9bd9dc606_474c85d1.jpg',
      caption: 'Photobooth strips tucked away',
      dateLabel: 'Memory 06',
    },
  ],
  galleryPhotos: [
    {
      id: 'gal-1',
      imageUrl: '/assets/aistudio/2005fd6b81cce23998ab5bad1e45362a_4f9caeb5.jpg',
      caption: 'Little mirror snapshots and everyday laughs.',
      dateLabel: 'Moment 01',
    },
    {
      id: 'gal-2',
      imageUrl: '/assets/aistudio/b281b2a7451ef52f023c1c926943a376_10872624.jpg',
      caption: 'Cute stickers and my favorite face beside mine.',
      dateLabel: 'Moment 02',
    },
    {
      id: 'gal-3',
      imageUrl: '/assets/aistudio/a60ffef6d1185fa9d58fbc64e86ec0cc_501988a5.jpg',
      caption: 'Sharing one song in the quiet night.',
      dateLabel: 'Moment 03',
    },
    {
      id: 'gal-4',
      imageUrl: '/assets/aistudio/724f9d1bf7d1f20ac82d62ad24e2c221_f093b874.jpg',
      caption: 'Peeking over pages on a quiet trip together.',
      dateLabel: 'Moment 04',
    },
    {
      id: 'gal-5',
      imageUrl: '/assets/aistudio/406c5d62bc59851302eebdc9b18ef229_2f92bac5.jpg',
      caption: 'Photobooth strips kept right where I can see them.',
      dateLabel: 'Moment 05',
    },
    {
      id: 'gal-6',
      imageUrl: '/assets/aistudio/1931a141f358e43dd429bc9b73edf3dc_a465c97c.jpg',
      caption: 'Even through a screen, you brighten my afternoon.',
      dateLabel: 'Moment 06',
    },
    {
      id: 'gal-7',
      imageUrl: '/assets/aistudio/0f26aa5614c3557ca5dc808b7a1b3703_7dfecd9c.jpg',
      caption: 'Cozy moments and sleepy smiles caught in time.',
      dateLabel: 'Moment 07',
    },
    {
      id: 'gal-8',
      imageUrl: '/assets/aistudio/78343a2482a1ea12f3dceeee3ab46fab_022a9390.jpg',
      caption: 'Sweet celebrations and frosting-filled memories.',
      dateLabel: 'Moment 08',
    },
    {
      id: 'gal-9',
      imageUrl: '/assets/aistudio/5ab4323699279ca4f9ace09a967212a6_574d9bf6.jpg',
      caption: 'Goofy little snapshots I never want to delete.',
      dateLabel: 'Moment 09',
    },
    {
      id: 'gal-10',
      imageUrl: '/assets/aistudio/25d5f6bfadcaa437596eabb9bd9dc606_474c85d1.jpg',
      caption: 'Two frames tucked away like a favorite keepsake.',
      dateLabel: 'Moment 10',
    },
  ],
};
