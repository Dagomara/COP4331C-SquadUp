const router = require("express").Router();

router.get("/getFriends", (req, res) => {
    res.send("NO FRIENDS");
});

module.exports = router;
