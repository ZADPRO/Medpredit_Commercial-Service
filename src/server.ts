require("dotenv").config();

const express = require("express");
import { startCronJobs } from "./BatchProgram/dailyjobs";
// import AdminRoutes from "./Routes/admin/AdminRoutes";
import AssistantRoutes from "./Routes/Assistant/AssistantRoutes";
import AuthenticationRoutes from "./Routes/Authentication/AuthenticationRoutes";
import BatchRoutes from "./Routes/Batch/BatchRoutes";
import CommercialRoutes from "./Routes/Commercial/CommercialRoutes";
import DoctorRoutes from "./Routes/Doctor/DoctorRoutes";
import FileRoutes from "./Routes/MinIO/FileRoutes";
import WebsiteRoutes from "./Routes/Website/WebsiteRoutes";
const cors = require("cors");

const app = express();

// app.use(express.json());
app.use(express.json({ limit: "100mb" })); // Increase limit if needed
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use("/assets", express.static("assets"));

app.use(
  cors({
    origin: "*",
  })
);

app.use("/api/v1", AuthenticationRoutes);
app.use("/api/v1", AssistantRoutes);
app.use("/api/v1", DoctorRoutes);
app.use("/api/commercial", CommercialRoutes);
// app.use("/api/AdminRoutes", AdminRoutes);
// app.use("/api/BatchRoutes", BatchRoutes);
app.use("/api/v1/WebsiteRoutes", WebsiteRoutes);

startCronJobs();

// app.use("/api/WebsiteRoutes", WebsiteRoutes);
app.use("/fileUpload", FileRoutes);

app.listen(process.env.PORT);
