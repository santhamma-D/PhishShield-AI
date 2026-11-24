
def get_security_advice(question: str):
    question = question.lower().strip()

    if not question:
        return {
            "success": False,
            "answer": "Please enter a security question."
        }

    # Suspicious links
    if any(word in question for word in [
        "clicked", "clicking", "suspicious link",
        "unknown link", "opened a link"
    ]):
        answer = (
            "WHAT TO DO AFTER CLICKING A SUSPICIOUS LINK\n\n"
            "1. Close the suspicious webpage.\n"
            "2. Do not download files or enter personal details.\n"
            "3. If you entered your password, change it using the official website.\n"
            "4. Enable two-factor authentication.\n"
            "5. Run a security scan if you downloaded a file.\n"
            "6. Contact your bank if financial information was exposed."
        )

    # Password security
    elif any(word in question for word in [
        "password", "passcode", "credential"
    ]):
        answer = (
            "PASSWORD SECURITY TIPS\n\n"
            "1. Create long and unique passwords for every account.\n"
            "2. Never reuse passwords.\n"
            "3. Use a trusted password manager.\n"
            "4. Enable two-factor authentication.\n"
            "5. Never share passwords through messages or email."
        )

    # OTP protection
    elif any(word in question for word in [
        "otp", "one time password", "verification code",
        "authentication code"
    ]):
        answer = (
            "OTP AND VERIFICATION CODE SAFETY\n\n"
            "1. Never share your OTP with anyone.\n"
            "2. Do not approve unexpected login requests.\n"
            "3. Never enter an OTP on an unfamiliar website.\n"
            "4. Contact your bank about unexpected banking OTPs."
        )

    # Email scams
    elif any(word in question for word in [
        "email", "mail", "attachment", "inbox"
    ]):
        answer = (
            "EMAIL PHISHING DETECTION\n\n"
            "1. Verify the sender's complete email address.\n"
            "2. Watch for urgent payment requests.\n"
            "3. Avoid unexpected attachments.\n"
            "4. Inspect links before opening them.\n"
            "5. Verify unusual requests through another trusted channel."
        )

    # Hacked accounts
    elif any(word in question for word in [
        "hacked", "compromised", "account stolen",
        "unauthorized login"
    ]):
        answer = (
            "RECOVERING A COMPROMISED ACCOUNT\n\n"
            "1. Change your password using the official website.\n"
            "2. Sign out of other active sessions.\n"
            "3. Enable two-factor authentication.\n"
            "4. Check your recovery details.\n"
            "5. Review recent account activity.\n"
            "6. Contact the service provider if needed."
        )

    # SMS scams
    elif any(word in question for word in [
        "sms", "text message", "scam message",
        "fraud message", "fake message"
    ]):
        answer = (
            "SMS SCAM AWARENESS\n\n"
            "1. Be cautious of unexpected prize messages.\n"
            "2. Avoid shortened links from unknown senders.\n"
            "3. Never share OTPs or banking details.\n"
            "4. Verify claims through official channels.\n"
            "5. Block and report suspicious senders."
        )

    # Phishing websites
    elif any(word in question for word in [
        "phishing", "fake website", "suspicious website",
        "website safe", "identify a website"
    ]):
        answer = (
            "PHISHING WEBSITE PROTECTION\n\n"
            "1. Check domains for spelling mistakes.\n"
            "2. Be careful with unfamiliar domain extensions.\n"
            "3. Avoid unexpected password requests.\n"
            "4. HTTPS does not guarantee a website is safe.\n"
            "5. Never open suspicious links just to test them."
        )

    # General cybersecurity
    elif any(word in question for word in [
        "cybersecurity", "online safety",
        "internet safety", "security tips"
    ]):
        answer = (
            "YOUR CYBERSECURITY CHECKLIST\n\n"
            "1. Keep your operating system updated.\n"
            "2. Use unique passwords.\n"
            "3. Enable two-factor authentication.\n"
            "4. Avoid unknown links and downloads.\n"
            "5. Use secure networks.\n"
            "6. Back up important files."
        )

    else:
        answer = (
            "I can help with phishing websites, suspicious links, "
            "passwords, OTP safety, email scams, SMS scams, and "
            "compromised accounts. Please ask a specific question."
        )

    return {
        "success": True,
        "answer": answer
    }
