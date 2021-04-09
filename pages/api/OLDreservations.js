import db from '../../lib/db';

export default async function handler(req, res) {

    switch (req.method) {
        case 'GET':
            res.status(200).json(await db.getReservations());
            break;
    
        case 'POST':
            const newReservations = await db.updateReservations(req.body);
            res.status(200).json(newReservations);
            break;
        
        default:
            res.status(405).send('');
            break;
    }
}