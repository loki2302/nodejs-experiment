const assert = require('assert');
const http = require('http');
const express = require('express');
const Axios = require('axios');
const oauth = require('axios-oauth-client');
const OAuthServer = require('express-oauth-server');
const bodyParser = require('body-parser');

class OAuthModel {
    constructor() {
        const ALL_GRANTS = ['refresh_token', 'password'];

        this.clients = [
            { clientId: 'client1', clientSecret: 'client1Secret', redirectUris: [], grants: ALL_GRANTS }
        ];

        this.users = [
            { username: 'user1', password: 'password1' }
        ];

        this.tokens = [];
    }

    async getAccessToken(accessToken) {
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

    async getRefreshToken(refreshToken) {
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

    async getClient(clientId, clientSecret) {
        const clientOrUndefined = this.clients.find(c =>
            c.clientId === clientId && c.clientSecret == clientSecret);
        if (clientOrUndefined === undefined) {
            return false;
        }
        return {
            id: clientOrUndefined.clientId,
            redirectUris: clientOrUndefined.redirectUris,
            grants: clientOrUndefined.grants
        };
    }

    async getUser(username, password) {
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

describe('oauth2-server', () => {
    let server;
    beforeEach(done => {
        const app = express();

        app.oauth = new OAuthServer({
            model: new OAuthModel()
        });

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));

        app.post('/oauth/token', app.oauth.token());

        app.get('/hello', app.oauth.authenticate(), (req, res) => {
            const oauthContext = res.locals.oauth.token;
            const accessToken = oauthContext.accessToken;
            const scope = oauthContext.scope;
            const clientId = oauthContext.client.id;
            const user = oauthContext.user;
            res.send(`hello world! token=${accessToken}, scope=${scope}, clientId=${clientId}, userId=${user.userId}, some=${user.some}`);
        });

        server = http.createServer(app);
        server.listen(3000, () => {
            done();
        });
    });

    afterEach(done => {
        server.close(() => {
            done();
        });
    });

    it('does not let me in without token', async () => {
        const response = await Axios.request({
            method: 'get',
            url: 'http://localhost:3000/hello',
            validateStatus: () => true
        });
        assert.strictEqual(response.status, 401);
    });

    it('lets me in with a token', async () => {
        const getCredentialsViaUsernameAndPassword = oauth.client(Axios.create(), {
            url: 'http://localhost:3000/oauth/token',
            grant_type: 'password',
            client_id: 'client1',
            client_secret: 'client1Secret',
            username: 'user1',
            password: 'password1',
            scope: 'dummy'
        });

        const credentials = await getCredentialsViaUsernameAndPassword();
        const accessToken = credentials.access_token;
        const response = await Axios.request({
            method: 'get',
            url: 'http://localhost:3000/hello',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        assert.strictEqual(response.status, 200);
        assert.ok(response.data.includes('scope=dummy, clientId=client1, userId=user1, some=additional context2'));
    });

    it('lets me to refresh the token', async () => {
        const getCredentialsViaUsernameAndPassword = oauth.client(Axios.create(), {
            url: 'http://localhost:3000/oauth/token',
            grant_type: 'password',
            client_id: 'client1',
            client_secret: 'client1Secret',
            username: 'user1',
            password: 'password1',
            scope: 'dummy'
        });

        const firstCredentials = await getCredentialsViaUsernameAndPassword();
        const firstAccessToken = firstCredentials.access_token;
        const firstRefreshToken = firstCredentials.refresh_token;

        const getCredentialsViaRefreshToken = oauth.client(Axios.create(), {
            url: 'http://localhost:3000/oauth/token',
            grant_type: 'refresh_token',
            client_id: 'client1',
            client_secret: 'client1Secret',
            refresh_token: firstRefreshToken,
            scope: 'dummy'
        });
        const secondCredentials = await getCredentialsViaRefreshToken();
        const secondAccessToken = secondCredentials.access_token;
        const secondRefreshToken = secondCredentials.refresh_token;
        assert.notStrictEqual(secondAccessToken, firstAccessToken);
        assert.notStrictEqual(secondRefreshToken, firstRefreshToken);

        const response = await Axios.request({
            method: 'get',
            url: 'http://localhost:3000/hello',
            headers: {
                Authorization: `Bearer ${secondAccessToken}`
            }
        });
        assert.strictEqual(response.status, 200);
        assert.ok(response.data.includes('scope=dummy, clientId=client1, userId=user1, some=additional context2'));
    });
});
