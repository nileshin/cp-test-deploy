const proxy = require('http-proxy-middleware');
const wordpressNormalizer = require('./wordpress-normalizer');
const branch_info = require('./pantheon-branchname');
const autoprefixer = require('autoprefixer');
require('dotenv').config();

if (process.env.USE_LANDO) {
  console.log(
    `Building from local lando: ${branch_info.lando_environment_url}`
  );
} else {
  console.log(
    `Building from Pantheon env: ${branch_info.pantheon_environment_url}`
  );
}

const wordpressURL = process.env.USE_LANDO
  ? branch_info.lando_environment_url
  : branch_info.pantheon_environment_url;
const wordpressProtocol = process.env.USE_LANDO ? 'http' : 'https';

module.exports = {
  siteMetadata: {
    title: `Connelly Partners`,
    description: `An Integrated Agency`,
    author: `@connellyagency`,
    siteUrl: `https://www.connellypartners.com`,
  },
  developMiddleware: app => {
    app.use(
      '/.netlify/functions/',
      proxy({
        target: 'http://localhost:9000',
        pathRewrite: {
          '/.netlify/functions/': '',
        },
      })
    );
  },
  plugins: [
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-plugin-layout`,
      options: {
        component: require.resolve(`./src/components/layout.js`),
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        postCssPlugins: [
          autoprefixer({
            browsers: ['last 2 versions', '> 1%', 'ie 11'],
            grid: true,
          }),
        ],
      },
    },
    {
      resolve: `gatsby-plugin-svgr`,
      options: {
        include: /_global/,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `ConnellyPartners.com`,
        short_name: `CP.com`,
        description: `An Integrated Agency`,
        start_url: `/`,
        background_color: `#fafafa`,
        theme_color: `#b18925`,
        display: `browser`,
        icon: `src/images/cp-logo.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-source-wordpress`,
      options: {
        includedRoutes: [
          `**/*/taxonomies`,
          `**/*/pages`,
          `**/*/media`,
          `**/*/work`,
          `**/*/people`,
          `**/*/department`,
          `**/*/posts`,
          `**/*/categories`,
          `**/*/jobs`,
          `**/*/job-location`,
          `**/*/landing-pages`,
          `**/*/case-studies`,
          `**/cp/v1/menus`,
        ],
        baseUrl: wordpressURL,
        protocol: wordpressProtocol,
        useACF: true,
        searchAndReplaceContentUrls: {
          sourceUrl: `${wordpressProtocol}://${wordpressURL}`,
          replacementUrl: '', // todo: swap this from loco to prod based on brach/netlify env var
        },
        normalizer: wordpressNormalizer,
      },
    },
    {
      resolve: `gatsby-plugin-google-tagmanager`,
      options: {
        id: 'GTM-PSXGPJ5',
        includeInDevelopment: false,
      },
    },
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-robots-txt`,
      options: {
        resolveEnv: () => {
          if (process.env.PANTHEON_ENV === 'live') return 'production';
          return 'dev';
        },
        env: {
          dev: {
            policy: [{ userAgent: '*', disallow: ['/'] }],
          },
          production: {
            policy: [{ userAgent: '*', allow: '/' }],
          },
        },
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.app/offline
    // 'gatsby-plugin-offline',
  ],
};
