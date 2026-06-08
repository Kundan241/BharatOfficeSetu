const HASHNODE_API = 'https://gql.hashnode.com'
const PUBLICATION_ID = import.meta.env.VITE_HASHNODE_PUBLICATION_ID

// Fetch all posts for listing page
export const getAllPosts = async (page = 1) => {
  const query = `
    query GetPosts($id: ObjectId!, $page: Int!) {
      publication(id: $id) {
        posts(page: $page, pageSize: 9) {
          nodes {
            id
            title
            slug
            brief
            coverImage { url }
            publishedAt
            readTimeInMinutes
            tags { name slug }
            author {
              name
              profilePicture
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
          totalDocuments
        }
      }
    }
  `
  
  try {
    const response = await fetch(HASHNODE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': import.meta.env.VITE_HASHNODE_API_KEY
      },
      body: JSON.stringify({
        query,
        variables: { id: PUBLICATION_ID, page }
      })
    })
    
    const data = await response.json()
    return {
      posts: data.data.publication.posts.nodes,
      pageInfo: data.data.publication.posts.pageInfo,
      total: data.data.publication.posts.totalDocuments,
      error: null
    }
  } catch (error) {
    return { posts: [], error: error.message }
  }
}

// Fetch single post by slug
export const getPostBySlug = async (slug) => {
  const query = `
    query GetPost($id: ObjectId!, $slug: String!) {
      publication(id: $id) {
        post(slug: $slug) {
          id
          title
          slug
          content { html }
          brief
          coverImage { url }
          publishedAt
          updatedAt
          readTimeInMinutes
          tags { name slug }
          author {
            name
            profilePicture
            bio { html }
          }
          seo {
            title
            description
          }
        }
      }
    }
  `
  
  try {
    const response = await fetch(HASHNODE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': import.meta.env.VITE_HASHNODE_API_KEY
      },
      body: JSON.stringify({
        query,
        variables: { id: PUBLICATION_ID, slug }
      })
    })
    
    const data = await response.json()
    return {
      post: data.data.publication.post,
      error: null
    }
  } catch (error) {
    return { post: null, error: error.message }
  }
}

// Fetch posts by tag
export const getPostsByTag = async (tag) => {
  const query = `
    query GetPostsByTag($id: ObjectId!, $tag: String!) {
      publication(id: $id) {
        posts(page: 1, pageSize: 9, filter: { tagSlugs: [$tag] }) {
          nodes {
            id
            title
            slug
            brief
            coverImage { url }
            publishedAt
            readTimeInMinutes
            tags { name slug }
          }
        }
      }
    }
  `
  
  try {
    const response = await fetch(HASHNODE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': import.meta.env.VITE_HASHNODE_API_KEY
      },
      body: JSON.stringify({
        query,
        variables: { id: PUBLICATION_ID, tag }
      })
    })
    
    const data = await response.json()
    return {
      posts: data.data.publication.posts.nodes,
      error: null
    }
  } catch (error) {
    return { posts: [], error: error.message }
  }
}
