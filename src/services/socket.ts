import { io, Socket } from 'socket.io-client';
import store from '../redux/store';

const SOCKET_URL = process.env.NODE_ENV === 'production'
  ? (process.env.REACT_APP_BASE_URL || '').replace('/api/', '')
  : 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private authToken: string | null = null;

  connect(nextToken?: string | null): void {
    const token = nextToken || store.getState().auth.token;
    if (!token) return;
    if (this.socket?.connected && this.authToken === token) return;

    this.disconnect();
    this.authToken = token;

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 10,
    });

    // Re-register any existing listeners
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach((cb) => {
        this.socket?.on(event, cb);
      });
    });
  }

  disconnect(): void {
    this.authToken = null;
    this.socket?.removeAllListeners();
    this.socket?.disconnect();
    this.socket = null;
  }

  on(event: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    this.socket?.on(event, callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(callback);
      this.socket?.off(event, callback);
    };
  }

  off(event: string, callback?: (data: any) => void): void {
    if (callback) {
      this.listeners.get(event)?.delete(callback);
      this.socket?.off(event, callback);
    } else {
      this.listeners.delete(event);
      this.socket?.removeAllListeners(event);
    }
  }

  get isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

const socketService = new SocketService();
export default socketService;
