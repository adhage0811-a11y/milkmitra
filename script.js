let selectedRole = "";
let generatedOTP = "";

function showLogin(role) {
    selectedRole = role;

    const title = document.getElementById("loginTitle");

    if (role === "farmer") {
        title.textContent = "👨‍🌾 Farmer Login";
    } 
    else if (role === "customer") {
        title.textContent = "👤 Customer Login";
    } 
    else if (role === "admin") {
        title.textContent = "🏪 Dairy / Admin Login";
    }

    document.getElementById("otpBox").style.display = "none";
    document.getElementById("message").textContent = "";
    document.getElementById("mobile").value = "";
    document.getElementById("otp").value = "";
}

function sendOTP() {
    const mobile = document.getElementById("mobile").value.trim();

    if (!/^[6-9]\d{9}$/.test(mobile)) {
        document.getElementById("message").textContent =
            "❌ Enter a valid 10-digit Indian mobile number.";
        return;
    }

    generatedOTP = Math.floor(100000 + Math.random() * 900000);

    document.getElementById("otpBox").style.display = "block";

    document.getElementById("message").textContent =
        "✅ Demo OTP: " + generatedOTP;
}

function verifyOTP() {
    const enteredOTP = document.getElementById("otp").value.trim();

    if (!generatedOTP) {
        document.getElementById("message").textContent =
            "❌ First click Send OTP.";
        return;
    }

    if (enteredOTP === String(generatedOTP)) {
        document.getElementById("message").textContent =
            "✅ OTP Verified! " +
            selectedRole.charAt(0).toUpperCase() +
            selectedRole.slice(1) +
            " login successful.";
    } 
    else {
        document.getElementById("message").textContent =
            "❌ Wrong OTP. Please try again.";
    }
}
