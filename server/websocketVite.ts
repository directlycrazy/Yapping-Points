import type { ViteDevServer } from 'vite';
import injectSocketIO from './socketHandler';

export const webSocketServer = {
    name: 'webSocketServer',
    configureServer(server: ViteDevServer) {
        injectSocketIO(server.httpServer);
    }
};