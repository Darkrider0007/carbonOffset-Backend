import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import addProject from "./routes/addProject.routes.js";
import createCheckoutSession from "./routes/createCheckoutSession.routes.js";
import user from "./routes/user.routes.js";
import dashBoard from "./routes/dashboard.routes.js";
import token from "./routes/token.routes.js";
import admin from "./routes/admin.routes.js";
import farmOnboard from "./routes/farmOnboarding.routes.js";
import newslatterModel from "./routes/newslatter.routes.js";
import proposal from "./routes/proposal.routes.js";
import IndividualEmissions from "./routes/IndividualEmissions.routes.js";
import Membership from "./routes/membership.routes.js";
import VolunteerRegistration from "./routes/volunteerRegistration.routes.js";
import CollaborativeParticipation from "./routes/collaborativeParticipation.routes.js";

dotenv.config();

const app = express();

// Connect to the database
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the imported routes
app.use("/api/add-project", addProject);
app.use("/api/create-checkout-session", createCheckoutSession);
app.use("/api/token", token);
app.use("/api/user", user);
app.use("/api/dashboard", dashBoard);
app.use("/api/admin", admin);
app.use("/api/farmOnboard", farmOnboard);
app.use("/api/newsletter", newslatterModel);
app.use("/api/proposal", proposal);
app.use("/api/calculate-individual", IndividualEmissions);
app.use("/api/membership", Membership);
app.use("/api/volunteerRegistration", VolunteerRegistration);
app.use("/api/collaborativeParticipation", CollaborativeParticipation);

export default app;
