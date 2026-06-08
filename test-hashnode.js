const HASHNODE_API = 'https://gql.hashnode.com';
const PUBLICATION_ID = '6a1d3664196c32586f54fb3d';

async function test() {
  const query = `
    query GetPosts($id: ObjectId!, $page: Int!) {
      publication(id: $id) {
        posts(page: $page, pageSize: 1) {
          totalDocuments
        }
      }
    }
  `;
  try {
    const res = await fetch(HASHNODE_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { id: PUBLICATION_ID, page: 1 } })
    });
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Body:", text);
  } catch (err) {
    console.error("Fetch error:", err);
  }
}
test();
