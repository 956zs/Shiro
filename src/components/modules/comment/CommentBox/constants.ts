import { sample } from '~/lib/lodash'

const placeholderCopywrites = [
  '在這裡說點什麼呢。',
  'What would you like to say here?',
  '小可愛，你想說點什麼呢？',
  'Sweetie, what do you want to say?',
  '或許此地可以留下足跡',
  'Perhaps you could leave your footprints here',
  '你的留言是我前進的動力！',
  'Your comment motivates me to move forward!',
  '說點什麼吧，我會好好聽的。',
  "Say something, I'll listen carefully.",
  '來一發評論，送你一個小星星！',
  "Leave a comment and I'll give you a star!",
  '你的評論會讓我更加努力哦！',
  'Your comments will make me work harder!',
  '留下你的足跡，讓我知道你來過。',
  'Leave your mark to let me know you were here.',
  '我在這裡等你的留言呢！',
  "I'm waiting for your comment here!",
  '你的評論是我最大的動力！',
  'Your comments are my biggest motivation!',
  '來一發評論，讓我知道你的想法吧！',
  'Leave a comment and let me know what you think!',
]
export const getRandomPlaceholder = () => sample(placeholderCopywrites)

export const MAX_COMMENT_TEXT_LENGTH = 500
