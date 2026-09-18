/* =========================================
   MILKMITRA
   Smart Dairy Platform
========================================= */


/* =========================================
   RATE CHART
========================================= */

const rates = [
  {
    fat: 3.0,
    rate: 36
  },

  {
    fat: 3.5,
    rate: 40
  },

  {
    fat: 4.0,
    rate: 42
  },

  {
    fat: 4.5,
    rate: 44
  },

  {
    fat: 5.0,
    rate: 47
  }
];


/* =========================================
   LOCAL STORAGE
========================================= */

let bills =
  JSON.parse(
    localStorage.getItem("milkBills")
  ) || [];

let user =
  JSON.parse(
    localStorage.getItem("milkUser")
  ) || null;

let subscription =
  JSON.parse(
    localStorage.getItem("milkSubscription")
  ) || null;

let qualityRecords =
  JSON.parse(
    localStorage.getItem("milkQuality")
  ) || [];


/* =========================================
   PAGE NAVIGATION
========================================= */

function showPage(pageId) {

  const pages =
    document.querySelectorAll(".page");

  pages.forEach(page => {

    page.classList.remove("active");

  });


  const selectedPage =
    document.getElementById(pageId);

  if (selectedPage) {

    selectedPage.classList.add("active");

  }


  updateDashboard();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* =========================================
   LOGIN
========================================= */

let selectedRole = "";


function selectRole(role) {

  selectedRole = role;

  const form =
    document.getElementById("loginForm");

  form.classList.remove("hidden");


  document.getElementById(
    "selectedRole"
  ).textContent =
    role === "customer"
      ? "Selected: Customer"
      : "Selected: Farmer / Seller";
}


function loginUser() {

  const name =
    document.getElementById(
      "loginName"
    ).value.trim();

  const mobile =
    document.getElementById(
      "loginMobile"
    ).value.trim();


  if (!name) {

    alert("Please enter your name.");

    return;
  }


  if (!/^[0-9]{10}$/.test(mobile)) {

    alert(
      "Please enter a valid 10-digit mobile number."
    );

    return;
  }


  user = {

    name: name,

    mobile: mobile,

    role: selectedRole

  };


  localStorage.setItem(
    "milkUser",
    JSON.stringify(user)
  );


  alert(
    "Login successful!"
  );


  showPage("dashboard");

  updateDashboard();
}


/* =========================================
   RATE CALCULATION
========================================= */

function getRate(fat) {

  const validRates =
    rates.filter(
      item =>
        item.fat <= fat
    );


  if (validRates.length === 0) {

    return 0;

  }


  validRates.sort(
    (a, b) =>
      b.fat - a.fat
  );


  return validRates[0].rate;
}


/* =========================================
   MILK QUALITY
========================================= */

function getQuality(fat) {

  if (fat >= 4.5) {

    return "Excellent";

  }

  if (fat >= 4.0) {

    return "Good";

  }

  if (fat >= 3.5) {

    return "Standard";

  }

  return "Low";
}


/* =========================================
   CALCULATOR
========================================= */

function calculateMilk() {

  const quantity =
    Number(
      document.getElementById(
        "quantity"
      ).value
    ) || 0;


  const fat =
    Number(
      document.getElementById(
        "fat"
      ).value
    ) || 0;


  const rate =
    getRate(fat);


  const amount =
    quantity * rate;


  document.getElementById(
    "resultFat"
  ).textContent =
    fat.toFixed(1) + "%";


  document.getElementById(
    "resultRate"
  ).textContent =
    "₹" + rate + "/L";


  document.getElementById(
    "resultAmount"
  ).textContent =
    "₹" + amount.toFixed(2);


  document.getElementById(
    "homeAmount"
  ).textContent =
    "₹" + getRate(4.0) + "/L";
}


/* =========================================
   ADD BILL
========================================= */

function addMilkBill() {

  const quantity =
    Number(
      document.getElementById(
        "quantity"
      ).value
    );


  const fat =
    Number(
      document.getElementById(
        "fat"
      ).value
    );


  if (quantity <= 0) {

    alert(
      "Please enter milk quantity."
    );

    return;
  }


  if (fat <= 0) {

    alert(
      "Please enter fat percentage."
    );

    return;
  }


  const rate =
    getRate(fat);


  if (rate === 0) {

    alert(
      "No suitable rate found for this fat percentage."
    );

    return;
  }


  const amount =
    quantity * rate;


  const bill = {

    id: Date.now(),

    date:
      new Date()
        .toISOString()
        .slice(0, 10),

    customer:
      user
        ? user.name
        : "Walk-in Customer",

    quantity: quantity,

    fat: fat,

    rate: rate,

    amount: amount

  };


  bills.push(bill);


  localStorage.setItem(
    "milkBills",
    JSON.stringify(bills)
  );


  alert(
    "Bill added successfully!\n\n" +
    "Amount: ₹" +
    amount.toFixed(2)
  );


  renderBills();

  updateDashboard();
}


/* =========================================
   BILL TABLE
========================================= */

function renderBills() {

  const table =
    document.getElementById(
      "billTable"
    );


  if (!bills.length) {

    table.innerHTML = `
      <tr>
        <td
          colspan="7"
          class="empty"
        >
          No bills available.
        </td>
      </tr>
    `;

    updateStatistics();

    return;
  }


  table.innerHTML =
    bills
      .slice()
      .reverse()
      .map(
        bill => `

      <tr>

        <td>
          ${bill.date}
        </td>

        <td>
          ${escapeHTML(
            bill.customer
          )}
        </td>

        <td>
          ${bill.quantity.toFixed(1)} L
        </td>

        <td>
          ${bill.fat.toFixed(1)}%
        </td>

        <td>
          ₹${bill.rate}
        </td>

        <td>
          <strong>
            ₹${bill.amount.toFixed(2)}
          </strong>
        </td>

        <td>

          <button
            onclick="deleteBill(${bill.id})"
            style="
              border:none;
              background:none;
              color:#d92d20;
              cursor:pointer;
              font-weight:bold;
            "
          >
            Delete
          </button>

        </td>

      </tr>

    `
      )
      .join("");


  updateStatistics();
}


/* =========================================
   DELETE BILL
========================================= */

function deleteBill(id) {

  bills =
    bills.filter(
      bill =>
        bill.id !== id
    );


  localStorage.setItem(
    "milkBills",
    JSON.stringify(bills)
  );


  renderBills();

  updateDashboard();
}


/* =========================================
   CLEAR BILLS
========================================= */

function clearBills() {

  if (!bills.length) {

    alert(
      "There are no bills to clear."
    );

    return;
  }


  const confirmDelete =
    confirm(
      "Are you sure you want to delete all bills?"
    );


  if (!confirmDelete) {

    return;
  }


  bills = [];


  localStorage.setItem(
    "milkBills",
    JSON.stringify(bills)
  );


  renderBills();

  updateDashboard();
}


/* =========================================
   BILL STATISTICS
========================================= */

function updateStatistics() {

  const totalLitres =
    bills.reduce(
      (sum, bill) =>
        sum +
        Number(
          bill.quantity
        ),
      0
    );


  const totalAmount =
    bills.reduce(
      (sum, bill) =>
        sum +
        Number(
          bill.amount
        ),
      0
    );


  const weightedFat =
    bills.reduce(
      (sum, bill) =>
        sum +
        (
          Number(
            bill.quantity
          ) *
          Number(
            bill.fat
          )
        ),
      0
    );


  const avgFat =
    totalLitres > 0
      ? weightedFat /
        totalLitres
      : 0;


  document.getElementById(
    "totalLitres"
  ).textContent =
    totalLitres.toFixed(1) +
    " L";


  document.getElementById(
    "totalAmount"
  ).textContent =
    "₹" +
    totalAmount.toFixed(2);


  document.getElementById(
    "averageFat"
  ).textContent =
    avgFat.toFixed(2) +
    "%";
}


/* =========================================
   SUBSCRIPTION
========================================= */

function subscribe(litres) {

  const dailyRate =
    getRate(4.0);


  const dailyAmount =
    litres * dailyRate;


  const monthlyAmount =
    dailyAmount * 30;


  subscription = {

    litres: litres,

    dailyAmount: dailyAmount,

    monthlyAmount: monthlyAmount,

    startDate:
      new Date()
        .toISOString()
        .slice(0, 10)

  };


  localStorage.setItem(
    "milkSubscription",
    JSON.stringify(
      subscription
    )
  );


  showSubscription();


  alert(
    "Subscription activated!"
  );


  updateDashboard();
}


function showSubscription() {

  const element =
    document.getElementById(
      "subscriptionResult"
    );


  if (!subscription) {

    element.innerHTML =
      "No active subscription.";

    return;
  }


  element.innerHTML = `

    🥛 Active Subscription

    <br><br>

    Daily Milk:
    <strong>
      ${subscription.litres} L
    </strong>

    <br>

    Daily Amount:
    <strong>
      ₹${subscription.dailyAmount.toFixed(2)}
    </strong>

    <br>

    Estimated 30-Day Bill:
    <strong>
      ₹${subscription.monthlyAmount.toFixed(2)}
    </strong>

    <br><br>

    Started:
    ${subscription.startDate}

  `;
}


/* =========================================
   QUALITY RECORD
========================================= */

function saveQuality() {

  const fat =
    Number(
      document.getElementById(
        "qualityFat"
      ).value
    );


  const snf =
    Number(
      document.getElementById(
        "snf"
      ).value
    );


  const temperature =
    Number(
      document.getElementById(
        "temperature"
      ).value
    );


  if (
    fat <= 0 ||
    snf <= 0 ||
    isNaN(temperature)
  ) {

    alert(
      "Please fill all quality fields."
    );

    return;
  }


  const record = {

    date:
      new Date()
        .toISOString()
        .slice(0, 10),

    fat: fat,

    snf: snf,

    temperature: temperature,

    quality:
      getQuality(fat)

  };


  qualityRecords.push(record);


  localStorage.setItem(
    "milkQuality",
    JSON.stringify(
      qualityRecords
    )
  );


  document.getElementById(
    "qualityResult"
  ).innerHTML = `

    <div
      style="
        margin-top:15px;
        padding:14px;
        background:var(--soft);
        border-radius:10px;
      "
    >

      ✅ Record Saved

      <br><br>

      Fat:
      <strong>
        ${fat}%
      </strong>

      <br>

      SNF:
      <strong>
        ${snf}%
      </strong>

      <br>

      Temperature:
      <strong>
        ${temperature}°C
      </strong>

      <br>

      Quality:
      <strong>
        ${getQuality(fat)}
      </strong>

    </div>

  `;

}


/* =========================================
   DASHBOARD
========================================= */

function updateDashboard() {

  const welcome =
    document.getElementById(
      "welcomeUser"
    );


  if (user) {

    welcome.textContent =
      "Welcome, " +
      user.name +
      " 👋";

  } else {

    welcome.textContent =
      "Welcome! Please login to personalize your dashboard.";

  }


  const totalMilk =
    bills.reduce(
      (sum, bill) =>
        sum +
        Number(
          bill.quantity
        ),
      0
    );


  const totalSales =
    bills.reduce(
      (sum, bill) =>
        sum +
        Number(
          bill.amount
        ),
      0
    );


  const customers =
    new Set(
      bills.map(
        bill =>
          bill.customer
      )
    ).size;


  document.getElementById(
    "dashMilk"
  ).textContent =
    totalMilk.toFixed(1) +
    " L";


  document.getElementById(
    "dashSales"
  ).textContent =
    "₹" +
    totalSales.toFixed(2);


  document.getElementById(
    "dashCustomers"
  ).textContent =
    customers;


  document.getElementById(
    "dashSubscription"
  ).textContent =
    subscription
      ? subscription.litres +
        " L/day"
      : "None";


  const recent =
    document.getElementById(
      "recentActivity"
    );


  if (!bills.length) {

    recent.innerHTML = `
      <p class="muted">
        No recent activity.
      </p>
    `;

    return;
  }


  const latestBills =
    bills
      .slice(-5)
      .reverse();


  recent.innerHTML =
    latestBills
      .map(
        bill => `

        <div
          style="
            padding:10px 0;
            border-bottom:1px solid var(--border);
          "
        >

          🥛
          ${bill.quantity} L milk

          <br>

          <small
            style="color:var(--muted)"
          >
            ${bill.date}
            •
            Fat ${bill.fat}%
            •
            ₹${bill.amount.toFixed(2)}
          </small>

        </div>

      `
      )
      .join("");
}


/* =========================================
   DARK MODE
========================================= */

function toggleDarkMode() {

  document.body.classList.toggle(
    "dark"
  );


  const mode =
    document.body.classList.contains(
      "dark"
    )
      ? "dark"
      : "light";


  localStorage.setItem(
    "milkTheme",
    mode
  );
}


/* =========================================
   HTML SECURITY
========================================= */

function escapeHTML(value) {

  return value.replace(
    /[&<>"']/g,

    function(character) {

      return {

        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"

      }[character];

    }
  );
}


/* =========================================
   INITIALIZE WEBSITE
========================================= */

window.addEventListener(
  "DOMContentLoaded",
  function() {

    const savedTheme =
      localStorage.getItem(
        "milkTheme"
      );


    if (savedTheme === "dark") {

      document.body.classList.add(
        "dark"
      );

    }


    calculateMilk();

    renderBills();

    showSubscription();

    updateDashboard();

  }
);
