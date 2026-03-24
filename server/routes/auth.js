const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

router.get("/google",
    passport.authenticate("google", { scope: ["profile", "email" ]})
);

router.get("/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        const token = jwt.sign(
            {id: req.user.id},
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        const clientUrl = process.env.CLIENT_URL || "http://localhost:5174" || "https://akitchenai.in" || "https://akitchen.vercel.app" || "https://www.akitchenai.in";
        res.redirect(`${clientUrl}/profile?token=${token}`);
    }
);

module.exports = router;