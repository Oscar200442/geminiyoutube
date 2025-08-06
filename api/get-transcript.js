import { YoutubeTranscript } from 'youtube-transcript';

export default async function (request, response) {
    const { url } = request.body;

    // Tjek om der er en URL i request body
    if (!url) {
        return response.status(400).json({ error: 'YouTube URL mangler.' });
    }

    try {
        // Henter video ID fra URL'en
        const videoId = new URL(url).searchParams.get('v');
        if (!videoId) {
            throw new Error('Ugyldigt YouTube-link.');
        }

        // Henter transskriptionen
        const transcriptArray = await YoutubeTranscript.fetchTranscript(videoId, {
            lang: 'da' // Forsøg at hente dansk transskription, ellers falder den tilbage til andre
        });

        // Saml transskriptionen til en enkelt streng
        const transcriptText = transcriptArray.map(item => item.text).join(' ');

        return response.status(200).json({ transcript: transcriptText });

    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Kunne ikke hente transskription. Det kan være fordi, den automatiske transskription ikke er tilgængelig for dette sprog.' });
    }
}
