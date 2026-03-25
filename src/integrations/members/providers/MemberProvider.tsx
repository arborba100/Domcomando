import { ReactNode, useState, useEffect } from 'react';
import { MemberContext, Member } from '@/integrations/members/providers/MemberContext';

export function MemberProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Load member from Wix API on mount
    const loadMember = async () => {
      try {
        const response = await fetch('/api/auth/member');
        if (response.ok) {
          const memberData = await response.json();
          setMember(memberData);
          setIsAuthenticated(!!memberData._id);
        }
      } catch (error) {
        console.error('Failed to load member:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMember();
  }, []);

  const actions = {
    loadCurrentMember: async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/auth/member');
        if (response.ok) {
          const memberData = await response.json();
          setMember(memberData);
          setIsAuthenticated(!!memberData._id);
        }
      } catch (error) {
        console.error('Failed to load member:', error);
      } finally {
        setIsLoading(false);
      }
    },
    login: () => {
      // Redirect to login API
      window.location.href = '/api/auth/login';
    },
    logout: () => {
      // Clear member and redirect to logout API
      setMember(null);
      setIsAuthenticated(false);
      window.location.href = '/api/auth/logout';
    },
    clearMember: () => {
      setMember(null);
      setIsAuthenticated(false);
    },
  };

  return (
    <MemberContext.Provider
      value={{
        member,
        isAuthenticated,
        isLoading,
        actions,
      }}
    >
      {children}
    </MemberContext.Provider>
  );
}
