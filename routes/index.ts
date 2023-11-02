import express, { Application } from "express";
import { gateway } from "./gateway";

export function routes(app: Application) {
    app.use(express.json());
    app.use('/api/gateway', gateway);
}
