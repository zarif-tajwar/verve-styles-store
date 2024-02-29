import 'server-only';

export const SESSION_MAX_AGE_IN_DAYS = 30;
export const SESSION_MAX_AGE = SESSION_MAX_AGE_IN_DAYS * 24 * 60 * 60;

export const authCookieNames = {
  OAUTH_STATE_GOOGLE: 'oauth_state_google',
  OAUTH_CODE_VERIFIER_GOOGLE: 'oauth_code_verifier_google',
  OAUTH_STATE_FACEBOOK: 'oauth_state_facebook',
  AFTER_REDIRECT_LINK: 'sign_in_after_redirect',
};
