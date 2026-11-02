
/* Sugar Bakes Bakery JavaScript */

(function () {
    "use strict";

    const bakeryEmail = "Sugarbakesbakery@gmail.com";
    const bakeryPhone = "0726253345";

    // Display messages on the website
    function showMessage(message, isError) {
        let status = document.getElementById("js-message");

        if (!status) {
            status = document.createElement("p");
            status.id = "js-message";
            status.setAttribute("role", "status");
            status.setAttribute("aria-live", "polite");
            document.body.appendChild(status);
        }

        status.textContent = message;
        status.style.color = isError ? "red" : "green";
        status.style.fontWeight = "bold";
    }

    // Validate the order page
    function validateOrder() {
        const submitButton = document.querySelector(
            'input[type="submit"], button[type="submit"]'
        );

        if (!submitButton) return;

        const inputs = Array.from(document.querySelectorAll("input"))
            .filter(input =>
                input.type !== "submit" &&
                input.type !== "button"
            );

        if (inputs.length < 5) return;

        const email = inputs.find(input => input.type === "email");
        const phone = inputs.find(input => input.type === "tel");
        const date = inputs.find(input => input.type === "date");

        const textInputs = inputs.filter(
            input => input.type === "text"
        );

        const name = textInputs[0];
        const message = textInputs[textInputs.length - 1];

        submitButton.addEventListener("click", function (event) {
            event.preventDefault();

            let errors = [];

            if (!name || name.value.trim() === "") {
                errors.push("Please enter your name.");
            }

            if (!email || email.value.trim() === "") {
                errors.push("Please enter your email address.");
            } else if (
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())
            ) {
                errors.push("Please enter a valid email address.");
            }

            if (
                phone &&
                phone.value.trim() !== "" &&
                !/^[+\d][\d\s()-]{6,}$/.test(phone.value.trim())
            ) {
                errors.push("Please enter a valid phone number.");
            }

            if (date && date.value) {
                const selectedDate = new Date(date.value + "T00:00:00");
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                if (selectedDate < today) {
                    errors.push("Please choose a future date.");
                }
            }

            if (!message || message.value.trim() === "") {
                errors.push("Please describe your order.");
            }

            if (errors.length > 0) {
                showMessage(errors.join(" "), true);
                return;
            }

            const orderDetails =
                "New order enquiry for Sugar Bakes Bakery\n\n" +
                "Name: " + name.value + "\n" +
                "Email: " + email.value + "\n" +
                "Phone: " + (phone ? phone.value : "Not provided") + "\n" +
                "Date: " + (date ? date.value : "Not specified") + "\n" +
                "Order: " + message.value;

            showMessage(
                "Your email app will open with your order details.",
                false
            );

            window.location.href =
                "mailto:" + bakeryEmail +
                "?subject=" +
                encodeURIComponent("Bakery Order Enquiry") +
                "&body=" +
                encodeURIComponent(orderDetails);
        });
    }

    // Make the bakery contact details clickable
    function makeContactDetailsClickable() {
        document.querySelectorAll("body *").forEach(element => {
            if (element.children.length === 0) {
                if (element.textContent.includes(bakeryEmail)) {
                    element.innerHTML = element.innerHTML.replace(
                        bakeryEmail,
                        '<a href="mailto:' + bakeryEmail + '">' +
                        bakeryEmail + '</a>'
                    );
                }

                if (element.textContent.includes(bakeryPhone)) {
                    element.innerHTML = element.innerHTML.replace(
                        bakeryPhone,
                        '<a href="tel:' + bakeryPhone + '">' +
                        bakeryPhone + '</a>'
                    );
                }
            }
        });
    }

    // Start JavaScript
    document.addEventListener("DOMContentLoaded", function () {
        validateOrder();
        makeContactDetailsClickable();
    });

})();


/* Products page search: filters the existing product image groups without
   changing the product names or image markup. */
document.addEventListener("DOMContentLoaded", function () {
    const productGroups = Array.from(document.querySelectorAll("body > ul"));
    if (!productGroups.length) return;

    const search = document.createElement("input");
    search.type = "search";
    search.id = "productSearch";
    search.placeholder = "Search product images...";
    search.setAttribute("aria-label", "Search bakery products");

    const firstHeading = productGroups[0].previousElementSibling;
    if (firstHeading) {
        firstHeading.insertAdjacentElement("afterend", search);
    } else {
        productGroups[0].insertAdjacentElement("beforebegin", search);
    }

    search.addEventListener("input", function () {
        const term = search.value.trim().toLowerCase();

        productGroups.forEach(function (group) {
            const heading = group.previousElementSibling;
            const headingText = heading ? heading.textContent.toLowerCase() : "";
            const imageText = Array.from(group.querySelectorAll("img"))
                .map(img => (img.alt || "").toLowerCase())
                .join(" ");
            const matches = (headingText + " " + imageText).includes(term);

            if (heading && /^H[1-6]$/.test(heading.tagName)) {
                heading.hidden = !matches;
            }
            group.hidden = !matches;
        });
    });
});
