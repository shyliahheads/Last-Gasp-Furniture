/*
User Flow Steps

0 Load inventory
1 Ask item
2 Ask quantity
3 Ask to continue
4 Ask shipping state
5 Do calculations
6 Show invoice
7 Reset
*/

// CONSTANTS
const TAX_RATE = 0.15;

const catalogItems = ["chair", "recliner", "table", "umbrella"];
const catalogPrices = [25.50, 37.75, 49.95, 24.89];

const stateList = [
"AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
"HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
"MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
"NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
"SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"
];

// VARIABLES
let cartItems = [];
let cartQty = [];

// Load table on page load
window.onload = function () {
    const body = document.getElementById("inventoryBody");

    for (let i = 0; i < catalogItems.length; i++) {
        body.innerHTML += `
            <tr>
                <td>${capitalize(catalogItems[i])}</td>
                <td>$${catalogPrices[i].toFixed(2)}</td>
            </tr>
        `;
    }
};

function startOrder() {

    cartItems = [];
    cartQty = [];

    while (true) {

        let chosenItem = prompt(
            "What item would you like to buy today: Chair, Recliner, Table or Umbrella?"
        );

        if (chosenItem === null) {
            alert("Order cancelled.");
            return;
        }

        chosenItem = chosenItem.toLowerCase();

        if (!catalogItems.includes(chosenItem)) {
            alert("That item is not in our inventory.");
            continue;
        }

        let quantity = prompt(`How many ${capitalize(chosenItem)} would you like to buy?`);

        if (quantity === null) {
            alert("Order cancelled.");
            return;
        }

        quantity = parseInt(quantity);

        if (isNaN(quantity) || quantity <= 0) {
            alert("Please enter a valid number.");
            continue;
        }

        cartItems.push(chosenItem);
        cartQty.push(quantity);

        let again = prompt("Continue shopping? y/n");

        if (again === null) {
            alert("Order cancelled.");
            return;
        }

        again = again.toLowerCase();

        if (again === "n") break;
        if (again !== "y") {
            alert("Invalid entry. Moving to checkout.");
            break;
        }
    }

    let stateCode = prompt("Enter two letter state abbreviation:");

    if (stateCode === null) {
        alert("Order cancelled.");
        return;
    }

    stateCode = stateCode.toUpperCase();

    if (!stateList.includes(stateCode)) {
        alert("Invalid state abbreviation.");
        return;
    }

    buildInvoice(stateCode);
}

function buildInvoice(stateCode) {

    let subtotal = 0;
    let invoiceHTML = "<h2>Invoice</h2>";
    invoiceHTML += "<table class='inventory'>";
    invoiceHTML += "<tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>";

    for (let i = 0; i < cartItems.length; i++) {

        const index = catalogItems.indexOf(cartItems[i]);
        const lineTotal = catalogPrices[index] * cartQty[i];

        subtotal += lineTotal;

        invoiceHTML += `
            <tr>
                <td>${capitalize(cartItems[i])}</td>
                <td>${cartQty[i]}</td>
                <td>$${catalogPrices[index].toFixed(2)}</td>
                <td>$${lineTotal.toFixed(2)}</td>
            </tr>
        `;
    }

    invoiceHTML += "</table>";

    const shippingCost = subtotal > 100 ? 0 : calculateShipping(stateCode);
    const taxAmount = subtotal * TAX_RATE;
    const finalTotal = subtotal + taxAmount + shippingCost;

    invoiceHTML += `
        <hr>
        <p>Ship To: ${stateCode}</p>
        <p>Subtotal: $${subtotal.toFixed(2)}</p>
        <p>Tax (15%): $${taxAmount.toFixed(2)}</p>
        <p>Shipping: $${shippingCost.toFixed(2)}</p>
        <h3>Total Due: $${finalTotal.toFixed(2)}</h3>
        <button class="resetBtn" onclick="resetPage()">Shop Again</button>
    `;

    document.getElementById("invoiceArea").innerHTML = invoiceHTML;
}

function calculateShipping(stateCode) {

    let zone;

    switch (stateCode) {
        case "AK":
        case "HI":
            zone = 6;
            break;
        case "WA":
        case "OR":
        case "CA":
            zone = 2;
            break;
        case "NV":
        case "ID":
        case "UT":
        case "AZ":
            zone = 3;
            break;
        case "MT":
        case "WY":
        case "CO":
        case "NM":
            zone = 4;
            break;
        case "TX":
        case "OK":
        case "KS":
        case "NE":
            zone = 5;
            break;
        default:
            zone = 1;
    }

    let cost;

    switch (zone) {
        case 1: cost = 0; break;
        case 2: cost = 20; break;
        case 3: cost = 30; break;
        case 4: cost = 35; break;
        case 5: cost = 45; break;
        case 6: cost = 50; break;
    }

    return cost;
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function resetPage() {
    document.getElementById("invoiceArea").innerHTML = "";
}
