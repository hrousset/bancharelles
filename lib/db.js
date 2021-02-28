import { promises as fs } from 'fs';
import path from 'path'

const dir = path.resolve('./lib');

export const getReservations = async () => {
    const json = await fs.readFile(`${dir}/reservations.json`);
    return JSON.parse(json);
}

export const updateReservations = async (newReservations) => {
    await fs.writeFile(`${dir}/reservations.json`, JSON.stringify(newReservations));
    return await getReservations();
}

export default {
    getReservations,
    updateReservations
}