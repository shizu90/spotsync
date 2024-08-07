export const calculateDistance = (p1: {lat: number, long: number}, p2: {lat: number, long: number}) => {
    const rad = (n: number) => n * Math.PI / 180;

    const r = 6371;

    let x1 = p2.lat - p1.lat;
    let dlat = rad(x1);
    let x2 = p2.long - p1.long;
    let dlong = rad(x2);
    let a = Math.sin(dlat/2) * Math.sin(dlat/2) + Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) * Math.sin(dlong / 2) * Math.sin(dlong / 2);

    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    let d = r * c;

    return d;
}