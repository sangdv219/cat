import { SandboxedJob } from 'bullmq';

export default async function (job: SandboxedJob) {
console.log(`📧 [Sandbox] Sending email to ${job.data.to}, subject: ${job.data.subject}`);
// TODO: gửi email thật bằng SMTP/SendGrid
};