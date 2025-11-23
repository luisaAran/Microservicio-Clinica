import { Queue } from 'bullmq';
import * as dotenv from 'dotenv';
dotenv.config();
const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
};
export class EventPublisher {
    private static instance: EventPublisher;
    private queue: Queue;
    private constructor() {
        this.queue = new Queue('clinic-events', { connection });
    }
    public static getInstance(): EventPublisher {
        if (!EventPublisher.instance) {
            EventPublisher.instance = new EventPublisher();
        }
        return EventPublisher.instance;
    }
    public async publish(eventName: string, payload: any): Promise<void> {
        const event = {
            eventName,
            timestamp: Math.floor(Date.now() / 1000),
            payload,
        };
        await this.queue.add(eventName, event);
        console.log(`[EventPublisher] Published event: ${eventName}`, event);
    }
}
