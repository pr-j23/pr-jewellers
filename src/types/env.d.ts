interface ImportMetaEnv {
  readonly VITE_MAILGUN_API_KEY: string;
  readonly VITE_MAILGUN_DOMAIN_NAME: string;
  readonly VITE_MAILGUN_SENDING_MAIL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
