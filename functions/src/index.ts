import * as admin from "firebase-admin";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { logger } from "firebase-functions/v2";

admin.initializeApp();

export const rolsSync = onDocumentWritten("users/{userId}", async (event) => {
  const { userId } = event.params;
  const newData = event.data?.after.data();
  const previousData = event.data?.before.data();

  if (!newData) return;

  const newRole = newData.role;
  const previousRole = previousData?.role;

  if (newRole !== previousRole) {
    await admin.auth().setCustomUserClaims(userId, { role: newRole });
    logger.info(`Custom claims updated for ${userId}: role = ${newRole}`);
  }
});
