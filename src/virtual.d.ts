interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly MODE: boolean;
  readonly BASE_URL: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly SSR: boolean;

  readonly SENTRY_TOKEN: string;
  readonly FIDER_API_TOKEN: string;
  readonly LISTMONK_API_TOKEN: string;
  readonly LISTMONK_API_LOGIN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "virtual:uno.css" {
  const content: string;
  export default content;
}
