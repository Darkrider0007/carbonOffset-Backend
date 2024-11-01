import axios from "axios";
import { ConfidentialClientApplication } from "@azure/msal-node";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the current file path and directory (works like __dirname in CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Config for Azure app authentication
const config = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
  },
};

const pca = new ConfidentialClientApplication(config);

// Get OAuth2 token from Azure AD
async function getToken() {
  try {
    const result = await pca.acquireTokenByClientCredential({
      scopes: ["https://graph.microsoft.com/.default"],
    });
    return result.accessToken;
  } catch (error) {
    console.error("Error acquiring token:", error);
    throw error;
  }
}

// Send email with HTML content using Microsoft Graph API
async function sendEmail(accessToken, subject, htmlContent, toRecipients) {
  const url = `https://graph.microsoft.com/v1.0/users/${process.env.MAIL_ADDRESS}/sendMail`;

  const email = {
    message: {
      subject: subject,
      body: {
        contentType: "HTML",
        content: htmlContent,
      },
      toRecipients: toRecipients.map((email) => ({
        emailAddress: { address: email },
      })),
    },
    saveToSentItems: "true",
  };

  try {
    const response = await axios.post(url, email, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Email sent successfully");
    return response.data;
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

// Main function to send OTP email with dynamic OTP content
export default async function sendOtp(email, otp) {
  try {
    // Get the OAuth2 token
    const token = await getToken();

    // Read HTML content from the file
    const htmlFilePath = path.join(__dirname, "template", "emailTemplate.html");
    let htmlContent = fs.readFileSync(htmlFilePath, "utf-8");

    // Inject the dynamic OTP into the HTML content
    htmlContent = htmlContent.replace("{{OTP}}", otp);

    // Send email with the updated HTML content via Microsoft Graph API
    await sendEmail(token, "Your OTP Code", htmlContent, [email]);

    console.log("OTP email sent successfully with HTML content");
  } catch (error) {
    console.error("Error in sendOtp function:", error.message);
  }
}

export async function welcomeMail(email) {
  try {
    // Get the OAuth2 token
    const token = await getToken();

    // Read HTML content from the file
    const htmlFilePath = path.join(
      __dirname,
      "template",
      "AccountCreation.html"
    );
    let htmlContent = fs.readFileSync(htmlFilePath, "utf-8");

    // Send email with the updated HTML content via Microsoft Graph API
    await sendEmail(token, "Welcome to 1World1Nation", htmlContent, [email]);

    console.log("Welcome mail send successfully");
  } catch (error) {
    console.error("Error in sendOtp function:", error.message);
  }
}

export async function farmonboardingFormSubmitMail(email) {
  try {
    const token = await getToken();

    // Read HTML content from the file
    const htmlFilePath = path.join(
      __dirname,
      "template",
      "FarmOnboardingFormFill.html"
    );
    let htmlContent = fs.readFileSync(htmlFilePath, "utf-8");
    // Send email with the updated HTML content via Microsoft Graph API
    await sendEmail(
      token,
      "Thank you for submitting your Farm Onboarding Form",
      htmlContent,
      [email]
    );
  } catch (error) {
    throw error;
  }
}

export async function newFarmOnboardingNotfication(
  email,
  ownerName,
  organizationName,
  farmLocation,
  farmArea,
  reviewLink
) {
  try {
    const token = await getToken();

    // Read HTML content from the file
    const htmlFilePath = path.join(
      __dirname,
      "template",
      "NewFarmOnboardingNotfication.html"
    );
    let htmlContent = fs.readFileSync(htmlFilePath, "utf-8");

    // Replace placeholders in the HTML content with dynamic data
    htmlContent = htmlContent
      .replace("{{ownerName}}", ownerName)
      .replace("{{organizationName}}", organizationName)
      .replace("{{farmLocation}}", farmLocation)
      .replace("{{farmArea}}", farmArea)
      .replace("{{reviewLink}}", reviewLink);

    // Send email with the updated HTML content via Microsoft Graph API or your preferred service
    await sendEmail(token, "New Farm Onboarded", htmlContent, [email]);
  } catch (error) {
    console.error("Failed to send new farm onboarding notification:", error);
    throw error;
  }
}

export async function farmonboardingAccpectMail(email) {
  try {
    const token = await getToken();

    // Read HTML content from the file
    const htmlFilePath = path.join(
      __dirname,
      "template",
      "FarmonboardingAccpectMail.html"
    );
    let htmlContent = fs.readFileSync(htmlFilePath, "utf-8");
    // Send email with the updated HTML content via Microsoft Graph API
    await sendEmail(
      token,
      "Thank you for submitting your Farm Onboarding Form",
      htmlContent,
      [email]
    );
  } catch (error) {
    throw error;
  }
}

export async function farmonboardingRejectMail(email) {
  try {
    const token = await getToken();

    // Read HTML content from the file
    const htmlFilePath = path.join(
      __dirname,
      "template",
      "FarmonboardingRejectMail.html"
    );
    let htmlContent = fs.readFileSync(htmlFilePath, "utf-8");
    // Send email with the updated HTML content via Microsoft Graph API
    await sendEmail(
      token,
      "Thank you for submitting your Farm Onboarding Form",
      htmlContent,
      [email]
    );
  } catch (error) {
    throw error;
  }
}

export async function newsletterSubscribeMail(email) {
  try {
    const token = await getToken();

    // Use path.resolve for compatibility across different environments
    const htmlFilePath = path.resolve(
      __dirname,
      "template",
      "NewslatterSubscribeMail.html"
    );

    // Check if the file exists before trying to read it
    if (!fs.existsSync(htmlFilePath)) {
      throw new Error("Email template file not found.");
    }

    // Read HTML content from the file
    let htmlContent = fs.readFileSync(htmlFilePath, "utf-8");

    // Replace placeholders in the HTML content dynamically
    htmlContent = htmlContent
      .replace("{{subscriberName}}", email)
      .replace("{{websiteLink}}", process.env.CLIENT_URL);

    // Send email with the updated HTML content via Microsoft Graph API
    await sendEmail(
      token,
      "Thank you for subscribing to our newsletter",
      htmlContent,
      [email]
    );

    console.log(`Subscription email successfully sent to ${email}`);
  } catch (error) {
    console.error(
      "Failed to send newsletter subscription email:",
      error.message
    );
    throw error;
  }
}

export async function proposalSubmitMail(email, proposerName, websiteLink) {
  try {
    const token = await getToken();

    // Read HTML content from the file
    const htmlFilePath = path.join(__dirname, "template", "ProposalSubmit.html");
    let htmlContent = fs.readFileSync(htmlFilePath, "utf-8");

    // Replace placeholders with actual data
    htmlContent = htmlContent
      .replace("{{ proposerName }}", proposerName)
      .replace("{{ websiteLink }}", websiteLink);

    // Send email with the updated HTML content via Microsoft Graph API
    await sendEmail(token, "Thank you for submitting your proposal", htmlContent, [email]);
  } catch (error) {
    throw error;
  }
}

export async function proposalSubmittedMailToAdmin(proposalData) {
  try {
    const token = await getToken();

    // Read HTML content from the file
    const htmlFilePath = path.join(__dirname, "template", "ProposalSubmitedMailTOAdmin.html");
    let htmlContent = fs.readFileSync(htmlFilePath, "utf-8");

    // Replace placeholders in HTML content with actual data
    htmlContent = htmlContent
      .replace("{{ proposerName }}", proposalData.proposerName)
      .replace("{{ proposerEmail }}", proposalData.proposerEmail)
      .replace("{{ proposalDetails }}", proposalData.proposalDetails)
      .replace("{{ isNeedFund }}", proposalData.isNeedFund ? "Yes" : "No");

    // Send email to each admin
    const adminEmails = [process.env.ADMIN_EMAIL1, process.env.ADMIN_EMAIL2, process.env.ADMIN_EMAIL3];
    for (const adminEmail of adminEmails) {
      await sendEmail(token, "New Proposal Submitted", htmlContent, [adminEmail]);
    }
  } catch (error) {
    throw error;
  }
}
