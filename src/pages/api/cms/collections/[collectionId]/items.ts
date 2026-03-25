import type { APIRoute } from 'astro';

// Mock data store for development
const store = new Map<string, any[]>();

export const GET: APIRoute = async ({ params, url }) => {
  const { collectionId } = params;
  
  if (!collectionId) {
    return new Response(JSON.stringify({ error: 'Collection ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const limit = parseInt(url.searchParams.get('limit') || '50');
  const skip = parseInt(url.searchParams.get('skip') || '0');

  const collection = store.get(collectionId) || [];
  const items = collection.slice(skip, skip + limit);
  const totalCount = collection.length;
  const hasNext = skip + limit < totalCount;

  return new Response(
    JSON.stringify({
      items,
      totalCount,
      hasNext,
      currentPage: Math.floor(skip / limit),
      pageSize: limit,
      nextSkip: hasNext ? skip + limit : null,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};

export const POST: APIRoute = async ({ params, request }) => {
  const { collectionId } = params;

  if (!collectionId) {
    return new Response(JSON.stringify({ error: 'Collection ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { itemData, multiRefs } = await request.json();

    if (!store.has(collectionId)) {
      store.set(collectionId, []);
    }

    const collection = store.get(collectionId)!;
    const item = { ...itemData, ...multiRefs };
    collection.push(item);

    return new Response(JSON.stringify(item), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create item' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
