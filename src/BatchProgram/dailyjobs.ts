import cron from "node-cron";
import { CurrentTime } from "../Helper/CurrentTime";
import { sendUserCountMailModels } from "../Models/Batch/BatchModels";

export const startCronJobs = () => {
  // Runs every Friday at 10:00 AM
  cron.schedule("0 10 * * 5", async () => {
    console.log("📅 Running weekly user count email job (Friday 10:00 AM)", CurrentTime());

    try {
      const result = await sendUserCountMailModels();

      if (result?.status) {
        console.log("✅ Weekly email job completed successfully", CurrentTime());
      } else {
        console.error("❌ Weekly email job failed:", result?.message || "Unknown error");
      }
    } catch (error) {
      console.error("❌ Error in weekly email job:", error, CurrentTime());
    }
  });
};



// export const startCronJobs = () => {
//   // Runs every Wednesday at 12:05 PM
//   cron.schedule("11 12 * * 3", async () => {
//     console.log("📅 Running weekly user count email job (Wednesday 12:05 PM)", CurrentTime());

//     try {
//       const result = await sendUserCountMailModels();

//       if (result?.status) {
//         console.log("✅ Weekly email job completed successfully", CurrentTime());
//       } else {
//         console.error("❌ Weekly email job failed:", result?.message || "Unknown error");
//       }
//     } catch (error) {
//       console.error("❌ Error in weekly email job:", error, CurrentTime());
//     }
//   });
// };
