export class VerifyOTPResponseDto {
    success: boolean = true;
    otpToken: string; // Optional, if you want to include an OTP token
}