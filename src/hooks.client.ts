export async function handleError({ error, event }) {
    const errorId = crypto.randomUUID();

    // TODO: Error reporting
    console.log('error: ', error);

    return {
        message: 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.',
    };
}