import { Request, Response } from "express";
import { adminAuth } from "./firebase-admin.js";

type AuthResult =
    | { user: any; error: null }
    | { user: null; error: boolean };

export async function requireAuth(req: Request, res: Response): Promise<AuthResult> {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        res.status(401).json({ error: "Unauthorized" });
        return { user: null, error: true };
    }

    const idToken = authHeader.slice(7);

    try {
        const user = await adminAuth.verifyIdToken(idToken);
        return { user, error: null };
    } catch {
        res.status(401).json({ error: "Invalid or expired token" });
        return { user: null, error: true };
    }
}

