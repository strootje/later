interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly MODE: boolean;
  readonly BASE_URL: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly SSR: boolean;

  readonly VITE_FIDER_API_TOKEN?: string;
  readonly VITE_LISTMONK_API_TOKEN?: string;
  readonly VITE_LISTMONK_API_LOGIN?: string;
  readonly VITE_DATABASE_PATH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "virtual:uno.css" {
  const content: string;
  export default content;
}
