'use client';

import { useAuth } from "react-oidc-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.isAuthenticated) {
      const groups = auth.user?.profile["cognito:groups"];
      console.log("Authenticated user:", auth.user?.profile);
      console.log("Groups:", groups);

      if (Array.isArray(groups)) {
        router.replace(groups.includes("Admin") ? "/admin" : "/team");
      } else if (typeof groups === "string") {
        router.replace(groups === "Admin" ? "/admin" : "/team");
      } else {
        router.replace("/team");
      }
    }
  }, [auth.isAuthenticated, auth.user, router]);

  const signOutRedirect = () => {
    const clientId = "4fi4lbbl6t3oo8cs5jcsug9v8n";
    const logoutUri = "http://localhost:3000/logged-out";
    const cognitoDomain = "https://eu-north-1cxxydnnmg.auth.eu-north-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (auth.error) return <p className="text-red-600">Error: {auth.error.message}</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white rounded shadow-md">
      {auth.isAuthenticated ? (
        <>
          <h2 className="text-2xl font-semibold mb-2">
            Welcome, {auth.user?.profile?.email}
          </h2>
          <pre className="bg-gray-100 p-4 rounded text-sm max-w-xl overflow-auto">
            {auth.user?.profile
              ? JSON.stringify(auth.user.profile, null, 2)
              : "No user profile available."}
          </pre>
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => {
                auth.removeUser();
                router.push("/logged-out");
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Sign out (local)
            </button>
            <button
              onClick={signOutRedirect}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800"
            >
              Sign out (Cognito)
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-xl mb-4">You are not signed in</h2>
          <button
            onClick={() => auth.signinRedirect()}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-800"
          >
            Sign in
          </button>
        </>
      )}
    </div>
  );
}




// 'use client';

// import { useAuth } from "react-oidc-context";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";

// export default function Home() {
//   const auth = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (auth.isAuthenticated) {
//       const groups = auth.user?.profile["cognito:groups"];
//       console.log("Authenticated user:", auth.user?.profile);
//       console.log("Groups:", groups);

//       if (Array.isArray(groups)) {
//         router.replace(groups.includes("Admin") ? "/admin" : "/team");
//       } else if (typeof groups === "string") {
//         router.replace(groups === "Admin" ? "/admin" : "/team");
//       } else {
//         router.replace("/team");
//       }
//     }
//   }, [auth.isAuthenticated, auth.user, router]);

//   const signOutRedirect = () => {
//     const clientId = "4fi4lbbl6t3oo8cs5jcsug9v8n";
//     const logoutUri = "http://localhost:3000/logged-out";
//     const cognitoDomain = "https://eu-north-1cxxydnnmg.auth.eu-north-1.amazoncognito.com";
//     window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
//   };

//   if (auth.isLoading) return <p className="text-center mt-10">Loading...</p>;
//   if (auth.error) return <p className="text-red-600">Error: {auth.error.message}</p>;

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white rounded shadow-md">
//       {auth.isAuthenticated ? (
//         <>
//           <h2 className="text-2xl font-semibold mb-2">Welcome, {auth.user?.profile.email}</h2>
//           <pre className="bg-gray-100 p-4 rounded text-sm max-w-xl overflow-auto">
//             {JSON.stringify(auth.user.profile, null, 2)}
//           </pre>
//           <div className="flex gap-4 mt-4">
//             <button
//               onClick={() => {
//                 auth.removeUser();
//                 router.push("/logged-out");
//               }}
//               className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
//             >
//               Sign out (local)
//             </button>
//             <button
//               onClick={signOutRedirect}
//               className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800"
//             >
//               Sign out (Cognito)
//             </button>
//           </div>
//         </>
//       ) : (
//         <>
//           <h2 className="text-xl mb-4">You are not signed in</h2>
//           <button
//             onClick={() => auth.signinRedirect()}
//             className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-800"
//           >
//             Sign in
//           </button>
//         </>
//       )}
//     </div>
//   );
// }













