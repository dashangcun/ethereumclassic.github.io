// check all markdown for "contributor" fields, then upsert the avatar
const jsYaml = require(`js-yaml`);

exports.onCreateNode = async (
  {
    node,
    actions: { createNode, createParentChildLink },
    createNodeId,
    loadNodeContent,
    getNode,
    createContentDigest,
  },
  { instanceType }
) => {
  // LODO config limit by collection type
  function registerContributor({ page, githubId, locale }) {
    const newNode = {
      id: createNodeId(`${node.id} >>> CONTRIBUTOR ${githubId}`),
      githubId,
      locale,
      page,
      parent: node.id,
      internal: {
        contentDigest: createContentDigest({ locale, page, githubId }),
        type: "ContributorAvatar",
      },
    };
    createNode(newNode);
    createParentChildLink({ parent: node, child: newNode });
  }

  if (
    node.sourceInstanceName === instanceType &&
    node.internal.mediaType === `text/yaml` &&
    node.base.startsWith(`index.`)
  ) {
    const content = await loadNodeContent(node);
    const yaml = jsYaml.load(content) || {};
    const contributors = yaml.__contributors || yaml.contributors;
    if (contributors?.length) {
      contributors.forEach((githubId) =>
        registerContributor({
          githubId,
          page: node.relativeDirectory,
          locale: node.absolutePath.split(".").slice(-2)[0],
        })
      );
    }
  }
  if (node.internal.type === `Mdx`) {
    const parentNode = getNode(node.parent);
    if (
      parentNode.sourceInstanceName === instanceType &&
      node.frontmatter?.contributors?.length
    ) {
      node.frontmatter.contributors.forEach((githubId) => {
        registerContributor({
          githubId,
          page: parentNode.relativeDirectory,
          locale: node.fileAbsolutePath.split(".").slice(-2)[0],
        });
      });
    }
  }
};

exports.createSchemaCustomization = ({ actions: { createTypes } }) => {
  createTypes(`
    type ContributorAvatar implements Node {
      id: ID!
      githubId: String!
      page: String!
      locale: String!
    }  
  `);
};
