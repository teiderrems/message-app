import ProfilController from "@/controllers/profil.controller";
import { Router } from "express";
import multer from "multer";


const profilRouter = Router();

profilRouter.get("/:id", ProfilController.getProfilById);

profilRouter.post("/", multer().single("avatar"), ProfilController.createProfil);

profilRouter.put("/:id", ProfilController.updateProfil);

profilRouter.delete("/:id", ProfilController.deleteProfil);

export default profilRouter;