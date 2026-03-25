import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, url }) => {
  // In production, this would handle the OAuth callback from Wix
  // For development, just redirect back to home
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/',
    },
  });
};
