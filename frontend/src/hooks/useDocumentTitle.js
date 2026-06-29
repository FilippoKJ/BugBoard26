import { useEffect } from 'react';

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = `${title} | BugBoard26`;
    return () => { document.title = 'BugBoard26'; };
  }, [title]);
}
