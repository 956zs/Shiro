export const defaultLinkSections: LinkSection[] = [
  {
    name: 'About',
    links: [
      {
        name: 'About this site',
        href: '/about-site',
      },
      {
        name: 'About me',
        href: '/about-me',
      },
      {
        name: 'About this project',
        href: 'https://github.com/innei/Shiro',
        external: true,
      },
    ],
  },
  {
    name: 'More',
    links: [
      {
        name: 'Timeline',
        href: '/timeline',
      },
      {
        name: 'Friends',
        href: '/friends',
      },
      {
        name: 'Monitoring',
        href: 'https://status.shizuri.net/status/main',
        external: true,
      },
    ],
  },
  {
    name: 'Contact',
    links: [
      {
        name: 'Write a message',
        href: '/message',
      },
      {
        name: 'Send an email',
        href: 'mailto:i@innei.in',
        external: true,
      },
      {
        name: 'GitHub',
        href: 'https://github.com/innei',
        external: true,
      },
    ],
  },
]

export interface FooterConfig {
  linkSections: LinkSection[]
  otherInfo: OtherInfo
}
