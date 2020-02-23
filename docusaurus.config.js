module.exports = {
  title: 'Louis Tsai',
  tagline: 'The tagline of my site',
  url: 'https://louistsaitszho.github.io/',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'louistsaitszho',
  projectName: 'louistsaitszho.github.io',
  themeConfig: {
    navbar: {
      title: 'Louis Tsai',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.svg',
      },
      links: [
        {to: 'blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/facebook/docusaurus',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
          ],
        },
        {
          title: 'Social',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/louistsaitszho',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/louis993546',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Louis Tsai. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
