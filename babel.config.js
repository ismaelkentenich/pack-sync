module.exports = function (api) {
  const isTest = api.env("test");

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      !isTest && [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env",
          blocklist: null,
          allowlist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
    ].filter(Boolean),
  };
};
