export default function JestInstance(): boolean {
    return process.env.JEST_WORKER_ID !== undefined;
}