import { Injectable } from '@nestjs/common';

interface Client {
    clientId: string;
    clientSecret: string;
    redirectUris: string[];
    grants: string[];
}

interface User {
    username: string;
    password: string;
}

interface Token {
    accessToken: string;
    accessTokenExpiresAt: Date;
    refreshToken: string;
    refreshTokenExpiresAt: Date;
    scope: string;
    clientId: string;
    userId: string;
}

@Injectable()
export class OAuthModelService {
    private clients: Client[];
    private users: User[];
    private tokens: Token[];

    constructor() {
        this.clients = [
            {
                clientId: 'client1',
                clientSecret: 'client1Secret',
                redirectUris: [],
                grants: ['refresh_token', 'password']
            }
        ];

        this.users = [
            { username: 'user1', password: 'password1' }
        ];

        this.tokens = [];
    }

    async getAccessToken(accessToken: string) {
        const accessTokenOrUndefined = this.tokens.find(t => t.accessToken === accessToken);
        if (accessTokenOrUndefined === undefined) {
            return false;
        }

        return {
            accessToken: accessTokenOrUndefined.accessToken,
            accessTokenExpiresAt: accessTokenOrUndefined.accessTokenExpiresAt,
            scope: accessTokenOrUndefined.scope,
            client: {
                id: accessTokenOrUndefined.clientId
            },
            user: {
                userId: accessTokenOrUndefined.userId,
                some: 'additional context2'
            }
        };
    }

    async getRefreshToken(refreshToken: string) {
        const accessTokenOrUndefined = this.tokens.find(t => t.refreshToken === refreshToken);
        if (accessTokenOrUndefined === undefined) {
            return false;
        }

        return {
            refreshToken: accessTokenOrUndefined.refreshToken,
            refreshTokenExpiresAt: accessTokenOrUndefined.refreshTokenExpiresAt,
            scope: accessTokenOrUndefined.scope,
            client: {
                id: accessTokenOrUndefined.clientId
            },
            user: {
                userId: accessTokenOrUndefined.userId,
                some: 'additional context3'
            }
        };
    }

    async getClient(clientId: string, clientSecret: string) {
        const clientOrUndefined = this.clients.find(c =>
            c.clientId === clientId && c.clientSecret === clientSecret);
        if (clientOrUndefined === undefined) {
            return false;
        }
        return {
            id: clientOrUndefined.clientId,
            redirectUris: clientOrUndefined.redirectUris,
            grants: clientOrUndefined.grants
        };
    }

    async getUser(username: string, password: string) {
        const userOrUndefined = this.users.find(u => u.username === username && u.password === password);
        if (userOrUndefined === undefined) {
            return false;
        }
        return {
            userId: username,
            some: 'additional context1'
        };
    }

    async saveToken(token, client, user) {
        this.tokens = this.tokens.filter(t => t.accessToken !== token.accessToken);

        this.tokens.push({
            accessToken: token.accessToken,
            accessTokenExpiresAt: token.accessTokenExpiresAt,
            refreshToken: token.refreshToken,
            refreshTokenExpiresAt: token.refreshTokenExpiresAt,
            scope: token.scope,
            clientId: client.id,
            userId: user.userId
        });

        return {
            accessToken: token.accessToken,
            accessTokenExpiresAt: token.accessTokenExpiresAt,
            refreshToken: token.refreshToken,
            refreshTokenExpiresAt: token.refreshTokenExpiresAt,
            scope: token.scope,
            client,
            user
        };
    }

    async revokeToken(token) {
        const tokenOrUndefined = this.tokens.find(t => t.refreshToken === token.refreshToken);
        if (tokenOrUndefined !== undefined) {
            tokenOrUndefined.refreshToken = null;
            tokenOrUndefined.refreshTokenExpiresAt = null;
        }

        return true;
    }
}
