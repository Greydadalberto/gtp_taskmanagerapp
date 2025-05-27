"use client";

import { useAuth } from "react-oidc-context";

export default function Home() {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "4fi4lbbl6t3oo8cs5jcsug9v8n";
    const logoutUri = "http://localhost:3000";
    const cognitoDomain = "https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_CxxYDnnMG";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) return <p>Loading...</p>;
  if (auth.error) return <p>Error: {auth.error.message}</p>;

  if (auth.isAuthenticated) {
    return (
      <div>
        <h2>Welcome, {auth.user?.profile.email}</h2>
        <pre>{JSON.stringify(auth.user, null, 2)}</pre>
        <button onClick={() => auth.removeUser()}>Sign out (local)</button>
        <button onClick={signOutRedirect}>Sign out (Cognito)</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Not signed in</h2>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
    </div>
  );
}