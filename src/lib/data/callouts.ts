import { Callout } from '../types/callout'

export const callouts: Callout[] = [
  {
    name: 'note',
    icon: 'pencil'
  },
  {
    name: 'abstract',
    icon: 'clipboard-list',
    aliases: ['summary', 'tldr']
  },
  {
    name: 'info',
    icon: 'info'
  },
  {
    name: 'todo',
    icon: 'circle-check'
  },
  {
    name: 'tip',
    icon: 'flame',
    aliases: ['hint', 'important']
  },
  {
    name: 'success',
    icon: 'check',
    aliases: ['check', 'done']
  },
  {
    name: 'question',
    icon: 'circle-question-mark',
    aliases: ['help', 'faq']
  },
  {
    name: 'warning',
    icon: 'triangle-alert',
    aliases: ['caution', 'attention']
  },
  {
    name: 'failure',
    icon: 'x',
    aliases: ['fail', 'missing']
  },
  {
    name: 'danger',
    icon: 'zap',
    aliases: ['error']
  },
  {
    name: 'bug',
    icon: 'bug'
  },
  {
    name: 'example',
    icon: 'list'
  },
  {
    name: 'quote',
    icon: 'quote',
    aliases: ['cite']
  }
]
