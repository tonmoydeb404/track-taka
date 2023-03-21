const indexedDBConfig = {
  NAME: import.meta.env.MODE === "production" ? "TRACK_TAKA" : "DEV-TRACK_TAKA",
  VERSION: 1,
  STORE: "transections",
  OLD_STORE: "TRACK_TAKA_DB",
  KEY_PATH: "id",
};

export default indexedDBConfig;
