const env = (process.env.NODE_ENV || "development").trim();
if (env === "development") {
    require('dotenv').config();
}

type configType = {
    mode: string,
    uuid: RegExp,
    roomId: RegExp
}

export const config: configType = {
    mode: env,
    uuid: /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    roomId: /^R-[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
}