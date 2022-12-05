export function logError(callback?: NodeJS.ErrnoException | null) {
    if (callback != null) {
        console.error(callback);
    }
}