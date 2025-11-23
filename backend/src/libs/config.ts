import dotenv from 'dotenv';

dotenv.config();

export interface Config {
    port: number;
    firebase: {
        projectId: string;
        credentials: {
            clientEmail: string;
            privateKey: string;
        };
        client: {
            apiKey: string;
            authDomain: string;
            projectId: string;
            storageBucket: string;
            messagingSenderId: string;
            appId: string;
        };
    };
}

export const config: Config = {
    port: Number(process.env.PORT) || 3000,
    firebase: {
        projectId: process.env.FIREBASE_PROJECT_ID || '',
        credentials: {
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
            privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
        },
        client: {
            apiKey: process.env.FIREBASE_API_KEY || '',
            authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
            projectId: process.env.FIREBASE_PROJECT_ID || '',
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
            appId: process.env.FIREBASE_APP_ID || '',
        },
    },
};
