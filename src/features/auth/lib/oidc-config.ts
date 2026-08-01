import type { AuthProviderProps } from 'react-oidc-context'

export const oidcConfig: AuthProviderProps = {
  authority: `https://${import.meta.env.VITE_AUTH0_DOMAIN}`,
  client_id: import.meta.env.VITE_AUTH0_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_AUTH0_REDIRECT_URI,
  scope: 'openid profile email',
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname)
  },
}

export const auth0LogoutUrl = () => {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID
  const returnTo = encodeURIComponent(import.meta.env.VITE_AUTH0_LOGOUT_URI)
  return `https://${domain}/v2/logout?client_id=${clientId}&returnTo=${returnTo}`
}