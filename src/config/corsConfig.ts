const frontURL = process.env.FRONT_URL || "localhost";

export const corsConfig = {
    origin: [new RegExp(frontURL)],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}