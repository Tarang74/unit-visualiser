export default function JestInstance(): boolean {
    return import.meta.env.JEST_WORKER_ID !== undefined;
}
