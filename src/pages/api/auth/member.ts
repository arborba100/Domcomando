import type { APIRoute } from 'astro';

// Mock member data for development
const mockMember = {
  _id: 'test-user-123',
  loginEmail: 'test@example.com',
  loginEmailVerified: true,
  status: 'APPROVED',
  contact: {
    firstName: 'Test',
    lastName: 'User',
  },
  profile: {
    nickname: 'TestUser',
    title: 'Player',
  },
  _createdDate: new Date(),
  _updatedDate: new Date(),
};

export const GET: APIRoute = async ({ request }) => {
  // In production, this would validate the session and return the actual member
  // For now, return mock data
  
  return new Response(JSON.stringify(mockMember), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
