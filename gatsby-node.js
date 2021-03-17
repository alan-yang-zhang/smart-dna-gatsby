/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require('path');
const languages = require('./src/i18n/languages');
const axios = require('axios');
const crypto = require('crypto');

exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions;

  return new Promise(resolve => {
    const Redirect = path.resolve('src/i18n/redirect.jsx');
    const redirectPage = {
      ...page,
      component: Redirect,
      context: {
        languages,
        locale: '',
        routed: false,
        redirectPage: page.path,
      },
    };

    deletePage(page);
    createPage(redirectPage);

    languages.forEach(lang => {
      const localizedPath = `/${lang.locale}${page.path}`;
      const localePage = {
        ...page,
        originalPath: page.path,
        path: localizedPath,
        context: {
          languages,
          locale: lang.locale,
          routed: true,
          originalPath: page.path,
        },
      };
      createPage(localePage);
    });

    resolve();
  });
};

exports.sourceNodes = async ({ boundActionCreators }) => {
  const { createNode } = boundActionCreators;

  // fetch raw data from the randomuser api
  const fetchRandomUser = () => axios.get(`https://randomuser.me/api/?results=500`);
  // await for results
  const res = await fetchRandomUser();

  // map into these results and create nodes
  res.data.results.map((user, i) => {
    // Create your node object
    const userNode = {
      // Required fields
      id: `${i}`,
      parent: `__SOURCE__`,
      internal: {
        type: `RandomUser`, // name of the graphQL query --> allRandomUser {}
        // contentDigest will be added just after
        // but it is required
      },
      children: [],

      // Other fields that you want to query with graphQl
      gender: user.gender,
      name: {
        title: user.name.title,
        first: user.name.first,
        last: user.name.last,
      },
      picture: {
        large: user.picture.large,
        medium: user.picture.medium,
        thumbnail: user.picture.thumbnail,
      }
      // etc...
    }

    // Get content digest of node. (Required field)
    const contentDigest = crypto
      .createHash(`md5`)
      .update(JSON.stringify(userNode))
      .digest(`hex`);
    // add it to userNode
    userNode.internal.contentDigest = contentDigest;

    // Create node with the gatsby createNode() API
    createNode(userNode);
  });

  return;
};