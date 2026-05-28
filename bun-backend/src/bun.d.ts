declare module "bun" {
  interface Env {
    SPRING_CLOUD_CONFIG_COMPONENT_URI: string;
    EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE: string;
    MONGO_ATLAS_URI: string;
    MONGO_ATLAS_DB_NAME: string;
    API_KEY_API_FOOTBALL: string;
  }
}
