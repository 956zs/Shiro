export const defaultLinkSections: LinkSection[] = [
  {
    name: 'About',
    links: [
      {
        name: 'About This Site',
        href: '/about-site',
      },
      {
        name: 'About Me',
        href: '/about-me',
      },
      {
        name: 'About This Project',
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
        name: 'Status',
        href: 'https://status.shizuri.net/status/main',
        external: true,
      },
    ],
  },
  {
    name: 'Contact',
    links: [
      {
        name: 'Leave a Message',
        href: '/message',
      },
      {
        name: 'Send Email',
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
