import { AuthClient } from '@dfinity/auth-client';

const MAX_TTL = BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000);
const IDENTITY_PROVIDER =
  'http://' + import.meta.env.CANISTER_ID_INTERNET_IDENTITY + '.localhost:4943';

export async function getAuthClient() {
  return await AuthClient.create();
}

export async function login() {
  const authClient = window.auth.client;

  const isAuthenticated = await authClient.isAuthenticated();

  if (!isAuthenticated) {
    await authClient?.login({
      maxTimeToLive: MAX_TTL,
      identityProvider: IDENTITY_PROVIDER,
      onSuccess: async () => {
        window.auth.isAuthenticated = await authClient.isAuthenticated();
        window.location.reload();
      },
    });
  }
}

export async function logout() {
  const authClient = window.auth.client;
  authClient.logout();
  window.location.reload();
}
