"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoggedOutPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to sign-in page after 2 seconds
    const timer = setTimeout(() => {
      router.replace("/");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg">You have successfully signed out. Redirecting to sign in...</p>
    </div>
  );
}



// "use client";

// import { useEffect } from "react";
// import { useAuth } from "react-oidc-context";

// export default function LoggedOutPage() {
//   const auth = useAuth();

//   useEffect(() => {
//     if (!auth.isAuthenticated && !auth.isLoading) {
//       // User is logged out, redirect to sign in
//       auth.signinRedirect();
//     }
//   }, [auth.isAuthenticated, auth.isLoading, auth]);

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <p className="text-lg font-medium">You have been signed out. Redirecting to sign-in page...</p>
//     </div>
//   );
// }




// "use client";
// import { useEffect } from "react";
// import { useAuth } from "react-oidc-context";

// export default function LoggedOutPage() {
//   const auth = useAuth();

//   useEffect(() => {
//     // Redirect to login after logout completes
//     if (!auth.isAuthenticated && !auth.isLoading) {
//       auth.signinRedirect();
//     }
//   }, [auth.isAuthenticated, auth.isLoading]);

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <p>Signing you back in...</p>
//     </div>
//   );
// }
