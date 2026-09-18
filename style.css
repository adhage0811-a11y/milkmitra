```javascript
let selectedRole = "";
let generatedOTP = "";

function showLogin(role) {

    selectedRole = role;

    const title = document.getElementById("loginTitle");

    if (role === "farmer") {
        title.innerText = "👨‍🌾 Farmer Login";
    }

    else if (role === "customer") {
        title.innerText = "👤 Customer Login";
    }

    else if (role === "admin") {
        title.innerText = "🏪 Dairy / Admin Login";
    }

    document.getElementById("message").innerText = "";
    document.getElementById("otpBox").style.display = "none";
}


function sendOTP() {

    const mobile = document.getElementById("mobile").value;

    if (mobile.length !== 10 || isNaN(mobile)) {
        document.getElementById("message").innerText =
            "Please enter a valid 10-digit mobile number.";
        return;
    }

    // Demo OTP
    generatedOTP = Math.floor(100000 + Math.random() * 900000);

    console.log("Demo OTP:", generatedOTP);

    document.getElementById("otpBox").style.display = "block";

    document.getElementById("message").innerText =
        "OTP sent successfully. (Demo OTP: " + generatedOTP + ")";
}


function verifyOTP() {

    const enteredOTP = document.getElementById("otp").value;

    if (enteredOTP === generatedOTP.toString()) {

        document.getElementById("message").innerText =
            "✅ OTP Verified! " + selectedRole + " login successful.";

    } else {

        document.getElementById("message").innerText =
            "❌ Invalid OTP. Please try again.";

    }
}
```
