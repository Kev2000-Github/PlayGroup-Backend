const env = (process.env.NODE_ENV || "development").trim();
if (env === "development") {
    require('dotenv').config();
}

type configType = {
    mode: string,
}

export const config: configType = {
    mode: env,
}