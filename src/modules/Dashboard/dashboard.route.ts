import { authenticationMiddleware } from "@/middlewares/authentication.middleware";
import { Router } from "express";
import * as controller from "./dashboard.controller";

const router = Router();


router.get("/revenue", authenticationMiddleware, controller.getRevenueStats);
router.get("/ticket-sales", authenticationMiddleware, controller.getTicketSales);
router.get("/top-movies", authenticationMiddleware, controller.getTopMovies);
router.get("/top-customers", authenticationMiddleware, controller.getTopCustomers);
router.get("/customer-growth", authenticationMiddleware, controller.getCustomerGrowth);
router.get("/membership-distribution", authenticationMiddleware, controller.getMembershipDist);
router.get("/hourly-sales", authenticationMiddleware, controller.getHourlySales);
router.get("/occupancy", authenticationMiddleware, controller.getOccupancyStats);

export default router;