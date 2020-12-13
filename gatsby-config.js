module.exports = {
  siteMetadata: {
    title: `Louis Tsai`,
    name: `Louis Tsai`,
    siteUrl: `https://louis993546.com`,
    description: `Blog posts from Louis Tsai`,
    hero: {
      heading: `This is where Louis write all of his blog posts.`,
      maxWidth: 652,
    },
    social: [
      {
        name: `twitter`,
        url: `https://twitter.com/louis993546`,
      },
      {
        name: `github`,
        url: `https://github.com/louis993546`,
      },
      {
        name: `linkedin`,
        url: `https://www.linkedin.com/in/tsaitszho`,
      },
      {
        name: `medium`,
        url: `https://louis993546.medium.com`,
      },
      {
        name: `stackoverflow`,
        url: `https://stackoverflow.com/users/2384934/louis-tsai`,
      },
      {
        name: `unsplash`,
        url: `https://unsplash.com/@louis993546`,
      },
    ],
  },
  plugins: [
    {
      resolve: "@narative/gatsby-theme-novela",
      options: {
        contentPosts: "content/posts",
        contentAuthors: "content/authors",
        basePath: "/",
        authorsPage: false,
        sources: {
          local: true,
        },
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Novela by Narative`,
        short_name: `Novela`,
        start_url: `/`,
        background_color: `#fff`,
        theme_color: `#fff`,
        display: `standalone`,
        icon: `src/assets/favicon.png`,
      },
    }
  ],
};
