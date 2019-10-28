import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientEntity, TokenEntity, UserEntity } from './entities';
import { Client, Falsey, PasswordModel, RefreshToken, RefreshTokenModel, Token, User } from 'oauth2-server';

@Injectable()
export class OAuthModelService implements OnModuleInit, PasswordModel, RefreshTokenModel {
    constructor(
        @InjectRepository(ClientEntity) private readonly clientEntityRepository: Repository<ClientEntity>,
        @InjectRepository(UserEntity) private readonly userEntityRepository: Repository<UserEntity>,
        @InjectRepository(TokenEntity) private readonly tokenEntityRepository: Repository<TokenEntity>) {
    }

    async onModuleInit(): Promise<void> {
        if (await this.clientEntityRepository.count() === 0) {
            const client1 = new ClientEntity();
            client1.clientId = 'client1';
            client1.clientSecret = 'client1Secret';
            client1.redirectUris = [];
            client1.grants = ['refresh_token', 'password'];
            await this.clientEntityRepository.save(client1);
        }

        if (await this.userEntityRepository.count() === 0) {
            const user1 = new UserEntity();
            user1.username = 'user1';
            user1.password = 'password1';
            await this.userEntityRepository.save(user1);
        }
    }

    async getAccessToken(accessToken: string): Promise<Token | Falsey> {
        const token = await this.tokenEntityRepository.findOne(accessToken, { relations: ['client', 'user'] });
        if (token === undefined) {
            return false;
        }

        return {
            accessToken: token.accessToken,
            accessTokenExpiresAt: token.accessTokenExpiresAt,
            scope: token.scope,
            client: {
                id: token.client.clientId,
                redirectUris: token.client.redirectUris,
                grants: token.client.grants
            },
            user: {
                username: token.user.username
            }
        };
    }

    async getRefreshToken(refreshToken: string): Promise<RefreshToken | Falsey> {
        const token = await this.tokenEntityRepository.findOne({ refreshToken }, { relations: ['client', 'user'] });
        if (token === undefined) {
            return false;
        }

        return {
            refreshToken: token.refreshToken,
            refreshTokenExpiresAt: token.refreshTokenExpiresAt,
            scope: token.scope,
            client: {
                id: token.client.clientId,
                redirectUris: token.client.redirectUris,
                grants: token.client.grants
            },
            user: {
                username: token.user.username
            }
        };
    }

    async getClient(clientId: string, clientSecret: string): Promise<Client | Falsey> {
        const client = await this.clientEntityRepository.findOne({ clientId, clientSecret });
        if (client === undefined) {
            return false;
        }
        return {
            id: client.clientId,
            redirectUris: client.redirectUris,
            grants: client.grants
        };
    }

    async getUser(username: string, password: string): Promise<User | Falsey> {
        const user = await this.userEntityRepository.findOne({ username, password });
        if (user === undefined) {
            return false;
        }
        return {
            username: user.username
        };
    }

    async revokeToken(token: RefreshToken | Token): Promise<boolean> {
        const tokenEntity = await this.tokenEntityRepository.findOne({ refreshToken: token.refreshToken });
        if (tokenEntity !== undefined) {
            tokenEntity.refreshToken = undefined;
            tokenEntity.refreshTokenExpiresAt = undefined;
            await this.tokenEntityRepository.save(tokenEntity);
        }
        return true;
    }

    async saveToken(token: Token, client: Client, user: User): Promise<Token | Falsey> {
        let tokenEntity = await this.tokenEntityRepository.findOne(token.accessToken);
        if (tokenEntity === undefined) {
            tokenEntity = new TokenEntity();
            tokenEntity.accessToken = token.accessToken;
        }
        tokenEntity.accessTokenExpiresAt = token.accessTokenExpiresAt;
        tokenEntity.refreshToken = token.refreshToken;
        tokenEntity.refreshTokenExpiresAt = token.refreshTokenExpiresAt;
        tokenEntity.scope = Array.isArray(token.scope) ? token.scope : [token.scope];
        tokenEntity.client = await this.clientEntityRepository.findOneOrFail(client.id);
        tokenEntity.user = await this.userEntityRepository.findOneOrFail(user.username);
        await this.tokenEntityRepository.save(tokenEntity);

        return {
            accessToken: token.accessToken,
            accessTokenExpiresAt: token.accessTokenExpiresAt,
            refreshToken: token.refreshToken,
            refreshTokenExpiresAt: token.refreshTokenExpiresAt,
            scope: token.scope,
            client: {
                id: client.clientId,
                redirectUris: client.redirectUris,
                grants: client.grants
            },
            user: {
                username: user.username
            }
        };
    }

    async verifyScope(token: Token, scope: string | string[]): Promise<boolean> {
        return Promise.resolve(true);
    }
}
