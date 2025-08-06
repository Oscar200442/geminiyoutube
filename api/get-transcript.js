import { YoutubeTranscript } from 'youtube-transcript';

export default async function (request, response) {
    const { url } = request.body;

    if (!url) {
        return response.status(400).json({ error: 'YouTube URL mangler.' });
    }

    // Funktion til at udtrække video ID fra forskellige URL-formater
    function extractVideoId(url) {
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    try {
        const videoId = extractVideoId(url);

        if (!videoId) {
            throw new Error('Ugyldigt YouTube-link. Kunne ikke finde video ID.');
        }

        // Henter transskriptionen
        const transcriptArray = await YoutubeTranscript.fetchTranscript(videoId, {
            lang: 'da' 
        });

        const transcriptText = transcriptArray.map(item => item.text).join(' ');

        return response.status(200).json({ transcript: transcriptText });

    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Kunne ikke hente transskription. Sørg for at linket er korrekt, og at videoen har en tilgængelig transskription.' });
    }
}
