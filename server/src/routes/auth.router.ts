import express from "express";
import passport from "passport";
import { isLoggedIn } from "../helpers/passport";
import { APIError } from "./helper.router";
import { genToken, uuid } from "../helpers/utils";
import { userModel, IUser } from "../mongodb/schemas/user";

const router = express.Router();

export const AuthRouter = router;

// Kullanıcı bilgilerini getir
router.get("/@me", isLoggedIn, (req, res) => {
  const user = req.user as IUser;
  user.password = ""; // Şifreyi gizle
  res.send(user);
});

router.post("/login", (req, res) => {
  passport.authenticate(
    "local",
    async (err: any, user: any, message: string) => {
      if (err) return APIError(res, err);
      if (!user) return APIError(res, message);

      const model = await userModel.findOne({ id: user.id });
      if (!model) return APIError(res, "User is not found!");

      const ip = req.headers["x-forwarded-for"];

      // Modify User
      model.lastLogin.ip = String(ip);
      model.lastLogin.date = Date.now().toString();
      model.token = await genToken(); // This refreshes token for each login!

      // Update User
      await model.save();

      return res.send({ token: "Bearer " + model.token });
    }
  )(req, res);
});

// Yeni kullanıcı kaydı
router.post("/register", async (req, res) => {
  let { username, email, password, displayName } = req.body;
  username = username.toLowerCase();

  // Kullanıcı adı veya e-posta adresi veritabanında mevcutsa kontrol et
  const userExist = await userModel.findOne({ $or: [{ username }, { email }] });

  if (userExist) {
    return APIError(res, "This username/email is already taken!");
  }

  // Yeni kullanıcı verisini oluştur ve kaydet
  const newUser = await userModel.create({
    id: uuid(),
    createdAt: new Date(),
    displayName,
    username,
    email,
    password,
    token: await genToken(),
  });

  res.send(newUser);
});
