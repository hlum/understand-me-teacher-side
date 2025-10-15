/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_ENDPOINT: string;
    readonly VITE_API_KEY: string;
    readonly VITE_TEACHER_APIKEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
