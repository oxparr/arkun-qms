
import { useEffect, useState } from 'react';

type Listener = (data: any) => void;

class SocketService {
    private socket: WebSocket | null = null;
    private listeners: Map<string, Listener[]> = new Map();

    connect() {
        if (this.socket) return;

        // In dev: ws://localhost:3001, in prod: wss://host/
        const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = 'localhost:3001'; // Hardcoded for dev now, should be relative if served by same backend

        this.socket = new WebSocket(`${proto}//${host}`);

        this.socket.onopen = () => {
            console.log('WebSocket Connected');
        };

        this.socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                const type = data.type;
                const handlers = this.listeners.get(type);
                if (handlers) {
                    handlers.forEach(h => h(data));
                }
            } catch (e) {
                console.error('WS Parse Error', e);
            }
        };

        this.socket.onclose = () => {
            console.log('WebSocket Disconnected');
            this.socket = null;
            // Reconnect logic could go here
            setTimeout(() => this.connect(), 5000);
        };
    }

    on(event: string, callback: Listener) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)?.push(callback);
    }

    off(event: string, callback: Listener) {
        const handlers = this.listeners.get(event);
        if (handlers) {
            this.listeners.set(event, handlers.filter(h => h !== callback));
        }
    }
}

export const socketService = new SocketService();

export function useSocket(event: string, callback: Listener) {
    useEffect(() => {
        socketService.connect();
        socketService.on(event, callback);
        return () => {
            socketService.off(event, callback);
        };
    }, [event, callback]);
}
