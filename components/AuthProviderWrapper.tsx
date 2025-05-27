"use client";

import { AuthProvider } from "react-oidc-context";
import React from "react";

const oidcConfig = {
  authority: "https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_CxxYDnnMG",
  client_id: "4fi4lbbl6t3oo8cs5jcsug9v8n",
  redirect_uri: "http://localhost:3000",
  response_type: "code",
  scope: "openid email",
};

export default function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider {...oidcConfig}>{children}</AuthProvider>;
}