import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allSealLakeEnvs.edges

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="All posts" />
      {posts.map(({ node }) => {
        const title = node.envelope.retrievalId
        return (
          <article key={node.envelope.retrievalId}>
            <header>
              <h3
                style={{
                  marginBottom: rhythm(1 / 4),
                }}
              >
                <Link style={{ boxShadow: `none` }} to={node.envelope.retrievalId}>
                  {title}
                </Link>
              </h3>
              <small>{node.envelope.name}</small>
            </header>
            <section>
              <p
                dangerouslySetInnerHTML={{
                  __html: node.envelope.retrievalId,
                }}
              />
            </section>
          </article>
        )
      })}
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allSealLakeEnvs {
      edges {
        node {
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
