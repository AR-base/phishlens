/* ============================================================
   PhishLens — Email Dataset
   10 realistic scenarios used by the simulator module.
   Each email is tagged with category and red-flag indicators
   to drive both feedback and dashboard analytics.
   ============================================================ */

window.EMAILS = [
  {
    id: 1,
    sender: "PayPal Security <service@paypa1-security.com>",
    date: "Today 09:14",
    subject: "Urgent: Your account will be suspended in 24 hours",
    body: "Dear Customer,\n\nWe detected suspicious login attempts on your PayPal account. To avoid permanent suspension, please verify your identity immediately by clicking the link below:\n\nhttps://paypa1-secure-login.com/verify\n\nFailure to act within 24 hours will result in account closure.\n\nPayPal Security Team",
    isPhishing: true,
    category: "urgency",
    redFlags: [
      "Misspelled sender domain (paypa1 vs paypal)",
      "Urgency / 24-hour deadline",
      "Suspicious link domain",
      "Generic greeting ('Dear Customer')",
      "Threat of account closure"
    ]
  },
  {
    id: 2,
    sender: "GitHub <noreply@github.com>",
    date: "Yesterday 14:22",
    subject: "[GitHub] A new SSH key was added to your account",
    body: "Hi anish-dev,\n\nA new SSH key was added to your GitHub account:\n\nKey: MacBook Pro – ESAIP\nAdded: May 25, 2026\n\nIf you did not add this key, you can remove it from your security settings: https://github.com/settings/keys\n\nThanks,\nThe GitHub Team",
    isPhishing: false,
    category: "legitimate",
    redFlags: []
  },
  {
    id: 3,
    sender: "HR Department <hr-dept@company-payroll-2026.net>",
    date: "Today 07:30",
    subject: "Your May payroll statement is ready",
    body: "Hello,\n\nYour May salary statement is attached as a secure PDF. Please download and review.\n\n[ Attachment: Payroll_May_2026.pdf.exe ]\n\nIf you have questions, reply to this email.\n\nHR Team",
    isPhishing: true,
    category: "attachment_threat",
    redFlags: [
      "Suspicious external domain (not the real company domain)",
      "Executable file disguised as PDF (.pdf.exe)",
      "Generic greeting",
      "Unsolicited attachment"
    ]
  },
  {
    id: 4,
    sender: "Amazon <auto-confirm@amazon.fr>",
    date: "2 days ago",
    subject: "Your order #408-7194621 has shipped",
    body: "Hello Anish,\n\nGreat news — your order has shipped and is on its way.\n\nOrder: Logitech MX Master 3S\nEstimated delivery: May 28\n\nTrack your package in the Amazon app or on amazon.fr.\n\nThanks for shopping with us.",
    isPhishing: false,
    category: "legitimate",
    redFlags: []
  },
  {
    id: 5,
    sender: "Microsoft 365 <account-team@outlook-verify.support>",
    date: "Today 11:02",
    subject: "Action required: Re-authenticate your mailbox",
    body: "Hello,\n\nYour Microsoft 365 password is set to expire today. To keep your access, please re-authenticate using the secure portal:\n\nhttps://outlook-verify.support/login\n\nYou'll be asked to enter your current password and confirm a new one.\n\nMicrosoft Account Team",
    isPhishing: true,
    category: "credential_harvest",
    redFlags: [
      "Domain is not microsoft.com",
      "Asks to enter current password (legit Microsoft never does this)",
      "Vague urgency ('expire today')",
      "Suspicious 'support' TLD"
    ]
  },
  {
    id: 6,
    sender: "Netflix <info@netflix.com>",
    date: "3 days ago",
    subject: "New sign-in on a Windows device",
    body: "Hi Anish,\n\nWe noticed a new sign-in to your Netflix account on a Windows device in Angers, France on May 23 at 21:14.\n\nIf this was you, no action is needed. If not, sign in to your account at netflix.com and change your password.\n\n— Netflix",
    isPhishing: false,
    category: "legitimate",
    redFlags: []
  },
  {
    id: 7,
    sender: "DHL Express <tracking@dhl-parcel-fr.com>",
    date: "Today 08:45",
    subject: "Your package is on hold — customs fee €2.99 required",
    body: "Dear customer,\n\nYour parcel (FR-882910) is on hold at our facility because customs fees have not been paid.\n\nPay €2.99 here to release your shipment: https://dhl-parcel-fr.com/pay\n\nThis link expires in 24 hours.\n\nDHL Express",
    isPhishing: true,
    category: "credential_harvest",
    redFlags: [
      "Domain is not dhl.com",
      "Suspiciously small fee designed to seem harmless",
      "Urgency / link expiry",
      "Asks for payment info via untrusted link",
      "Generic greeting"
    ]
  },
  {
    id: 8,
    sender: "Slack <feedback@slack.com>",
    date: "4 days ago",
    subject: "How was your experience in the ESAIP-Group4 workspace?",
    body: "Hi Anish,\n\nThanks for using Slack! We'd love to hear how things are going in your workspace.\n\nTake the 2-minute survey: https://slack.com/feedback\n\nYour answers help us improve. No login required.\n\n— The Slack Team",
    isPhishing: false,
    category: "legitimate",
    redFlags: []
  },
  {
    id: 9,
    sender: "IT Helpdesk <it.support@esaip-helpdesk.org>",
    date: "Today 10:18",
    subject: "Mandatory: Confirm your student credentials",
    body: "Dear ESAIP student,\n\nDue to a recent security upgrade, all students must re-confirm their login credentials before May 27 or lose access to school systems.\n\nConfirm here: https://esaip-helpdesk.org/login\n\nProvide your username, password, and date of birth.\n\nESAIP IT Helpdesk",
    isPhishing: true,
    category: "spoofed_sender",
    redFlags: [
      "Domain is .org instead of official esaip.com",
      "Asks for password directly in a form",
      "Asks for date of birth (identity theft)",
      "Urgency / deadline",
      "Real IT departments never ask for your password"
    ]
  },
  {
    id: 10,
    sender: "LinkedIn <messages-noreply@linkedin.com>",
    date: "5 days ago",
    subject: "Sarah Martin sent you a message",
    body: "Hi Anish,\n\nYou have a new message from Sarah Martin, Recruiter at Capgemini.\n\nReply on LinkedIn: https://linkedin.com/messaging\n\nYou're receiving this because of your messaging settings.\n\n— LinkedIn",
    isPhishing: false,
    category: "legitimate",
    redFlags: []
  }
];

/* Category display labels — used by the dashboard module */
window.CATEGORY_LABELS = {
  urgency:            "Urgency Tactics",
  credential_harvest: "Credential Harvesting",
  attachment_threat:  "Malicious Attachments",
  spoofed_sender:     "Spoofed Senders",
  legitimate:         "Legitimate Emails"
};
