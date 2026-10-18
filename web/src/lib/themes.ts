/** Fotoachtergrond per positie in een raster van 4 kolommen: 5 kleuren, dus nooit dezelfde kleur naast of onder elkaar. */
const PHOTO = ['#1E55A8', '#C8202B', '#F7C52B', '#1F7A4D', '#E8731A'];
export const photoTint = (index: number) => PHOTO[index % PHOTO.length];
