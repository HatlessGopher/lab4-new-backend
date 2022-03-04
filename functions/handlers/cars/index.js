const { db } = require("../../utils/admin");

// get all cars
exports.getCars = async (req, res) => {
  const email = req.user.email;

  let result = [];

  let carCollection = await db.collection(`/users/${email}/cars`).get();

  for (let doc of carCollection.docs) {
    // prepare result
    result.push({
      id: doc.id,
      ...doc.data(),
    });
  }
  return res.status(200).json({ result: result });
};

// get a single car
exports.getCar = async (req, res) => {
  const email = req.user.email;

  let id = req.params.id;

  let carDoc = await db.doc(`/users/${email}/cars/${id}`).get();
  if (!carDoc.exists) return res.status(200).json({ result: {} });

  // prepare result
  let result = carDoc.data();
  // make sure id is added before return
  result.id = carDoc.id;

  return res.status(200).json({ result: result });
};

// add a single car
exports.addCar = async (req, res) => {
  const email = req.user.email;

  let car = req.body.car;

  let carDoc = db.collection(`/users/${email}/cars`).doc();
  carDoc.set({
    model: car.model,
    parked: car.parked,
    color: car.color,
  });
  // make sure id is added before return
  car.id = carDoc.id;

  return res.status(200).json({ result: car });
};

// update a single car
exports.updateCar = async (req, res) => {
  const email = req.user.email;

  let id = req.params.id;
  let parked = req.body.parked;

  let carDocRef = db.doc(`/users/${email}/cars/${id}`);
  await carDocRef.update({
    parked: parked,
  });

  let carDoc = await carDocRef.get();
  let result = carDoc.data();
  result.id = carDoc.id;

  return res.status(200).json({ result: result });
};

// sell a car
exports.deleteCar = async (req, res) => {
  const email = req.user.email;
  let id = req.params.id;

  let carDocRef = db.doc(`/users/${email}/cars/${id}`);
  await carDocRef.delete();

  return res.status(200).json({ result: true });
};
