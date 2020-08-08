const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  const result = await graphql(
    `{
      allSealLakeEnvs {
        edges {
          node {
            fields {
              slug
            }
            envelope {
              dataHash
              name
              retrievalId
              owner
              storage {
                contenttype
                url
              }
              metadata {
                storage {
                  url
                  contenttype
                }
              }
            }
          }
        }
      }
    }
    `
  )

  if (result.errors) {
    throw result.errors
  }

  // Create blog posts pages.
  const posts = result.data.allSealLakeEnvs.edges

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    createPage({
      path: post.node.fields.slug,
      component: blogPost,
      context: {
        slug: post.node.fields.slug,
        previous,
        next,
      },
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `sealLakeEnvs`) {
    const value = node.envelope.retrievalId
    // const value = createFilePath({ node, getNode })

    createNodeField({
      name: `slug`,
      node,
      value: `/${value}`,
    })
  }
}
