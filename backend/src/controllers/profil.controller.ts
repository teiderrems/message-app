import ProfilService from "@/services/profil.service";
import { convertFileToProfile } from "@/util";
import { Request, Response } from "express";

export default class ProfilController{

    static async createProfil(req: Request, res: Response) {
        
        const { userId } = req.body;

        try {
            const profil = await ProfilService.createProfil(userId as number, convertFileToProfile(req)!);
            return res.status(201).json(profil);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    static async updateProfil(req: Request, res: Response) {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Bad Request" });
        }
        try {
            const profil = await ProfilService.updateProfil(Number(id), convertFileToProfile(req)!);
            return res.status(200).json(profil);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    static async deleteProfil(req: Request, res: Response) {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Bad Request" });
        }
        try {
            await ProfilService.deleteProfil(Number(id));
            return res.status(204).send();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }


    static async getProfilById(req: Request, res: Response) {
        const { id } = req.params;
    
        if (!id) {
          return res.status(400).json({ error: "Invalid profil ID" });
        }
    
        try {
          const profil = await ProfilService.getProfilById(+id);
          if (profil) {
            res.set({
                'Content-Type': profil.mimetype,
                'Content-Disposition': `inline; filename="${profil.filename}"`,
                'Content-Length': profil.data.length,
            });
            return res.status(200).send(profil.data);
          }
          return res.status(404).json({ error: "Profil not found" });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: "Failed to retrieve profil" });
        }
      }
}