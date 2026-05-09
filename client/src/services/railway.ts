const RAILWAY_GQL = 'https://backboard.railway.app/graphql/v2';

export async function fetchRailwayProjects(token: string) {
  const res = await fetch(RAILWAY_GQL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `{
        projects {
          edges {
            node {
              id
              name
              description
              createdAt
              updatedAt
            }
          }
        }
      }`,
    }),
  });
  if (!res.ok) throw new Error('Invalid Railway token');
  const data = await res.json();
  if (data.errors) throw new Error(data.errors[0].message);
  return data.data.projects.edges.map((e: { node: unknown }) => e.node);
}

export async function fetchRailwayUser(token: string) {
  const res = await fetch(RAILWAY_GQL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query: `{ me { name email } }` }),
  });
  if (!res.ok) throw new Error('Invalid Railway token');
  const data = await res.json();
  if (data.errors) throw new Error(data.errors[0].message);
  return data.data.me;
}
