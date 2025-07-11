import { sample } from '~/lib/lodash'

const placeholderCopywrites = [
  'What would you like to say here?',
  'Hey there, what do you want to share?',
  'Maybe you can leave a footprint here.',
  'Your comment motivates me to move forward!',
  "Say something, I'm all ears.",
  "Leave a comment and I'll send you a little star!",
  'Your comment will make me work even harder!',
  'Leave your mark and let me know you were here.',
  "I'm waiting for your comment here!",
  'Your comment is my biggest motivation!',
  'Leave a comment and let me know your thoughts!',
]
export const getRandomPlaceholder = () => sample(placeholderCopywrites)

export const MAX_COMMENT_TEXT_LENGTH = 500
