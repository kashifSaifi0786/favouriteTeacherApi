const router = require("express").Router();
const Student = require("../models/student");
const { verifyTokenAndAuthorization } = require("../middleware/verifyToken");

router.put("/addFav", verifyTokenAndAuthorization, async (req, res) => {
  const { email, favTeacher } = req.body;
  try {
    const student = await Student.findOneAndUpdate(
      { email },
      {
        $addToSet: { favTeacher },
      },
      { new: true }
    );

    const { password, ...rest } = student._doc;
    res.status(200).json(rest);

    //if you want to hide student details just uncomment below line and comment upper one.
    // res.status(200).json(`${favTeacher} is added to Favourite Teachers list.`);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/removeFav", verifyTokenAndAuthorization, async (req, res) => {
  const { email, favTeacher } = req.body;

  try {
    const student = await Student.findOneAndUpdate(
      { email },
      {
        $pull: { favTeacher },
      },
      { new: true }
    );

    const { password, ...rest } = student._doc;
    res.status(200).json(rest);

    //if you want to hide student details just uncomment below line and comment upper one.
    // res.status(200).json(`${favTeacher} is Removed from Favourite list.`);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/favTeacher", async (req, res) => {
  const favouriteTeacher = await Student.aggregate([
    { $unwind: "$favTeacher" },
    { $sortByCount: "$favTeacher" },
    { $limit: 1 },
  ]);
  res.status(200).json(favouriteTeacher);
});

module.exports = router;
