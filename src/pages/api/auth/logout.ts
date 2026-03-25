import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  // In production, this would clear the session and redirect to Wix logout
  // For development, just redirect back to home
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/',
    },
  });
};
