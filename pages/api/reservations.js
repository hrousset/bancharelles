import { connectToDatabase } from "../../util/mongodb";
const { MongoClient, ObjectId } = require('mongodb');

export default async (req, res) => {
  const { db } = await connectToDatabase();

  switch (req.method) {
      case 'GET':
          const reservations = await db
            .collection("Banch")
            .find({})
            .sort({ metacritic: -1 })
            .limit(20)
            .toArray();

          res.status(200).json(reservations);
          break;

      case 'POST':
          const newReservations = await db
            .collection("Banch")
            .insertOne(JSON.parse(req.body));
          res.status(200).json(newReservations);
          break;

      case 'DELETE':
          const delReservations = await db
            .collection("Banch")
            .deleteOne({_id: ObjectId(JSON.parse(req.body))});
          res.status(200).json(delReservations);
          break;

      // case 'UPDATE':
      //     const body = JSON.parse(req.body)
      //     console.log(body);
      //     const updatedReservations = await db
      //       .collection("Banch")
      //       .findOneAndReplace({_id: ObjectId(JSON.parse(body.id))}, JSON.parse(body.newRes));
      //     res.status(200).json(updatedReservations);
      //
      //     break;

      default:
          res.status(405).send('');
          break;
  }
};
