// script.js

const API_BASE_URL = "http://localhost:5000/sweets";

// --- DOM Elements ---
const addSweetForm = document.getElementById("add-sweet-form");
const addNameInput = document.getElementById("add-name");
const addCategoryInput = document.getElementById("add-category");
const addPriceInput = document.getElementById("add-price");
const addQuantityInput = document.getElementById("add-quantity");

const searchSweetForm = document.getElementById("search-sweet-form");
const searchNameInput = document.getElementById("search-name");
const searchCategoryInput = document.getElementById("search-category");
const searchMinPriceInput = document.getElementById("search-min-price");
const searchMaxPriceInput = document.getElementById("search-max-price");
const clearSearchBtn = document.getElementById("clear-search-btn");

// MODAL RELATED ELEMENTS
const updateSweetModal = document.getElementById("update-sweet-modal"); // New: Reference to the modal overlay
const updateSweetForm = document.getElementById("update-sweet-form"); // Still refers to the form inside the modal
const updateIdInput = document.getElementById("update-id");
const updateNameInput = document.getElementById("update-name");
const updateCategoryInput = document.getElementById("update-category");
const updatePriceInput = (document = document.getElementById("update-price"));
const updateQuantityInput = document.getElementById("update-quantity");
const cancelUpdateBtn = document.getElementById("cancel-update-btn");

const sweetTableBody = document.querySelector("#sweet-table tbody");
const searchSweetTableBody = document.querySelector(
  "#search-sweet-table tbody"
);
const noSweetsMessage = document.getElementById("no-sweets-message");
const noSearchSweetsMessage = document.getElementById(
  "no-search-sweets-message"
);
const messageContainer = document.getElementById("message-container");
const searchMessageContainer = document.getElementById(
  "search-message-container"
);

// --- Utility Functions ---
function displayMessage(msg, type) {
  messageContainer.innerHTML = `<div class="message ${type}">${msg}</div>`;
  setTimeout(() => {
    messageContainer.innerHTML = "";
  }, 5000); // Clear message after 5 seconds
}

function displaySearchMessage(msg, type) {
  searchMessageContainer.innerHTML = `<div class="message ${type}">${msg}</div>`;
  setTimeout(() => {
    searchMessageContainer.innerHTML = "";
  }, 5000); // Clear message after 5 seconds
}

function clearAddForm() {
  addNameInput.value = "";
  addCategoryInput.value = "";
  addPriceInput.value = "";
  addQuantityInput.value = "";
}

function clearSearchForm() {
  searchNameInput.value = "";
  searchCategoryInput.value = "";
  searchMinPriceInput.value = "";
  searchMaxPriceInput.value = "";
}
clearSearchBtn.addEventListener("click", () => {
  searchNameInput.value = "";
  searchCategoryInput.value = "";
  searchMinPriceInput.value = "";
  searchMaxPriceInput.value = "";
  fetchSweets(); // Reload all sweets
});

function showUpdateForm(sweet) {
  if (!sweet || !sweet.id) {
    console.warn("Invalid sweet data:", sweet);
    return;
  }

  // Populate form inputs
  updateIdInput.value = sweet.id;
  updateNameInput.value = sweet.name || "";
  updateCategoryInput.value = sweet.category || "";
  updatePriceInput.value = sweet.price || 0;
  updateQuantityInput.value = sweet.quantity || 0;

  // Show modal
  updateSweetModal.classList.remove("hidden");
  updateSweetModal.classList.add("visible");
}

function hideUpdateForm() {
  updateSweetForm.reset();

  // Hide modal
  updateSweetModal.classList.remove("visible");
  updateSweetModal.classList.add("hidden");
}

updateSweetModal.addEventListener("click", function (e) {
  if (e.target === updateSweetModal) {
    hideUpdateForm();
  }
});

function validateSweetData(data) {
  if (
    !data.name ||
    !data.category ||
    data.price === undefined ||
    data.quantity === undefined
  ) {
    return "All sweet properties (name, category, price, quantity) are required.";
  }
  if (isNaN(data.price) || parseFloat(data.price) < 0) {
    return "Price must be a non-negative number.";
  }
  if (isNaN(data.quantity) || parseInt(data.quantity) < 0) {
    return "Quantity must be a non-negative integer.";
  }
  return null; // No error
}

function validateQuantity(qty, fieldName) {
  if (isNaN(qty) || parseInt(qty) <= 0) {
    return `${fieldName} quantity must be a positive integer.`;
  }
  return null;
}

// --- API Interactions ---
async function fetchSweets(queryParams = "") {
  try {
    const response = await fetch(`${API_BASE_URL}${queryParams}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }
    const sweets = await response.json();
    console.log("Sweets received from backend:", sweets); // Debugging: log the received data
    if (queryParams && queryParams.trim() !== "") {
      renderSearchList(sweets);
    } else {
      renderSweetList(sweets);
    }
  } catch (error) {
    console.error("Error fetching sweets:", error);
    displayMessage(
      `Failed to load sweets: ${error.message}. Please ensure the backend server is running.`,
      "error"
    );
    renderSweetList([]); // Clear list on error
  }
}

async function addSweet(sweetData) {
  const validationError = validateSweetData(sweetData);
  if (validationError) {
    displayMessage(validationError, "error");
    return;
  }

  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sweetData),
    });

    const data = await response.json();
    if (response.ok) {
      displayMessage("Sweet added successfully!", "success");
      clearAddForm();
      fetchSweets(); // Refresh the list
    } else {
      displayMessage(data.error || "Failed to add sweet.", "error");
    }
  } catch (error) {
    console.error("Error adding sweet:", error);
    displayMessage("Network error. Could not connect to the server.", "error");
  }
}

async function updateSweet(id, sweetData) {
  const validationError = validateSweetData(sweetData);
  if (validationError) {
    displayMessage(validationError, "error");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sweetData),
    });

    const data = await response.json();
    if (response.ok) {
      displayMessage("Sweet updated successfully!", "success");
      hideUpdateForm(); // Hide the modal after update
      fetchSweets(); // Refresh the list
    } else {
      displayMessage(data.error || "Failed to update sweet.", "error");
    }
  } catch (error) {
    console.error("Error updating sweet:", error);
    displayMessage("Network error. Could not connect to the server.", "error");
  }
}

async function deleteSweet(id) {
  if (!confirm("Are you sure you want to delete this sweet?")) {
    return;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      displayMessage("Sweet deleted successfully!", "success");
      fetchSweets(); // Refresh the list
    } else {
      const data = await response.json();
      displayMessage(data.error || "Failed to delete sweet.", "error");
    }
  } catch (error) {
    console.error("Error deleting sweet:", error);
    displayMessage("Network error. Could not connect to the server.", "error");
  }
}

async function purchaseSweet(id, quantity) {
  const validationError = validateQuantity(quantity, "Purchase");
  if (validationError) {
    displayMessage(validationError, "error");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${id}/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: parseInt(quantity) }),
    });

    const data = await response.json();
    if (response.ok) {
      displayMessage("Sweet purchased successfully!", "success");
      fetchSweets(); // Refresh the list
    } else {
      displayMessage(data.error || "Failed to purchase sweet.", "error");
    }
  } catch (error) {
    console.error("Error purchasing sweet:", error);
    displayMessage("Network error. Could not connect to the server.", "error");
  }
}

async function restockSweet(id, quantity) {
  const validationError = validateQuantity(quantity, "Restock");
  if (validationError) {
    displayMessage(validationError, "error");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${id}/restock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: parseInt(quantity) }),
    });

    const data = await response.json();
    if (response.ok) {
      displayMessage("Sweet restocked successfully!", "success");
      fetchSweets(); // Refresh the list
    } else {
      displayMessage(data.error || "Failed to restock sweet.", "error");
    }
  } catch (error) {
    console.error("Error restock sweet:", error);
    displayMessage("Network error. Could not connect to the server.", "error");
  }
}

function renderSweetList(sweets) {
  sweetTableBody.innerHTML = "";
  console.log("Rendering sweets:", sweets);

  if (!Array.isArray(sweets) || sweets.length === 0) {
    noSweetsMessage.classList.remove("hidden");
    return;
  }
  noSweetsMessage.classList.add("hidden");

  sweets.forEach((sweet) => {
    if (!sweet || !sweet._id) {
      console.warn("Skipping invalid sweet:", sweet);
      return;
    }

    // Default fallback values
    const sweetId = sweet._id.toString();
    const name = sweet.name || "N/A";
    const category = sweet.category || "Uncategorized";
    const price = typeof sweet.price === "number" ? sweet.price : 0;
    const quantity = typeof sweet.quantity === "number" ? sweet.quantity : 0;

    const row = sweetTableBody.insertRow();
    row.innerHTML = `
  <td>${sweetId.substring(0, 8)}...</td>
  <td>${name}</td>
  <td>${category}</td>
  <td>$${price.toFixed(2)}</td>
  <td>${quantity}</td>
  <td>
    <div class="action-buttons">
      <!-- First Line: Edit & Delete -->
      <div class="action-buttons-row">
        <button class="btn btn-edit" 
                data-id="${sweetId}"
                data-name="${name}" 
                data-category="${category}"
                data-price="${price}" 
                data-quantity="${quantity}">
           Edit
        </button>
        <button class="btn btn-delete" data-id="${sweetId}">
           Delete
        </button>
      </div>

      <!-- Second Line: Purchase & Restock -->
      <div class="action-buttons-row">
        <input type="number" class="qty-input purchase-qty" placeholder="Qty" min="1" step="1">
        <button class="btn btn-purchase" data-id="${sweetId}">Buy</button>
        <input type="number" class="qty-input restock-qty" placeholder="Qty" min="1" step="1">
        <button class="btn btn-restock" data-id="${sweetId}">Add</button>
      </div>
    </div>
  </td>
`;
  });
}

function renderSearchList(sweets) {
  searchSweetTableBody.innerHTML = "";
  console.log("Rendering sweets:", sweets);

  if (!Array.isArray(sweets) || sweets.length === 0) {
    noSearchSweetsMessage.classList.remove("hidden");
    return;
  }
  noSearchSweetsMessage.classList.add("hidden");

  sweets.forEach((sweet) => {
    if (!sweet || !sweet._id) {
      console.warn("Skipping invalid sweet:", sweet);
      return;
    }

    // Default fallback values
    const sweetId = sweet._id.toString();
    const name = sweet.name || "N/A";
    const category = sweet.category || "Uncategorized";
    const price = typeof sweet.price === "number" ? sweet.price : 0;
    const quantity = typeof sweet.quantity === "number" ? sweet.quantity : 0;

    const row = searchSweetTableBody.insertRow();
    row.innerHTML = `
  <td>${sweetId.substring(0, 8)}...</td>
  <td>${name}</td>
  <td>${category}</td>
  <td>$${price.toFixed(2)}</td>
  <td>${quantity}</td>
`;
  });
}

function attachSweetListListeners() {
  // This listener is attached once to the table body and uses event delegation
  sweetTableBody.addEventListener("click", (event) => {
    const target = event.target;
    const sweetId = target.dataset.id; // Get data-id from the clicked button

    if (target.classList.contains("btn-edit")) {
      // Retrieve data from dataset attributes
      const sweet = {
        id: sweetId,
        name: target.dataset.name,
        category: target.dataset.category,
        price: parseFloat(target.dataset.price),
        quantity: parseInt(target.dataset.quantity),
      };
      showUpdateForm(sweet);
    } else if (target.classList.contains("btn-delete")) {
      deleteSweet(sweetId);
    } else if (target.classList.contains("btn-purchase")) {
      // Find the quantity input associated with this row/button
      const quantityInput = target
        .closest(".action-buttons")
        .querySelector(".purchase-qty");
      const quantity = quantityInput ? quantityInput.value : "";
      purchaseSweet(sweetId, quantity);
    } else if (target.classList.contains("btn-restock")) {
      // Find the quantity input associated with this row/button
      const quantityInput = target
        .closest(".action-buttons")
        .querySelector(".restock-qty");
      const quantity = quantityInput ? quantityInput.value : "";
      restockSweet(sweetId, quantity);
    }
  });
  // Add event listener to hide modal when clicking outside the content
  updateSweetModal.addEventListener("click", (event) => {
    if (event.target === updateSweetModal) {
      // Only close if clicking the overlay itself, not the content
      hideUpdateForm();
    }
  });
}

// --- Event Listeners ---

// Add Sweet Form
addSweetForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newSweet = {
    name: addNameInput.value.trim(),
    category: addCategoryInput.value.trim(),
    price: parseFloat(addPriceInput.value),
    quantity: parseInt(addQuantityInput.value),
  };
  addSweet(newSweet);
});

// Search Sweet Form
searchSweetForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const params = new URLSearchParams();
  if (searchNameInput.value.trim())
    params.append("name", searchNameInput.value.trim());
  if (searchCategoryInput.value.trim())
    params.append("category", searchCategoryInput.value.trim());
  if (searchMinPriceInput.value.trim())
    params.append("minPrice", parseFloat(searchMinPriceInput.value));
  if (searchMaxPriceInput.value.trim())
    params.append("maxPrice", parseFloat(searchMaxPriceInput.value));

  // Client-side validation for search price range
  const minPriceVal = parseFloat(searchMinPriceInput.value);
  const maxPriceVal = parseFloat(searchMaxPriceInput.value);

  if (searchMinPriceInput.value !== "" && isNaN(minPriceVal)) {
    displayMessage("Minimum price must be a number.", "error");
    return;
  }
  if (searchMaxPriceInput.value !== "" && isNaN(maxPriceVal)) {
    displayMessage("Maximum price must be a number.", "error");
    return;
  }
  if (
    minPriceVal > maxPriceVal &&
    searchMinPriceInput.value !== "" &&
    searchMaxPriceInput.value !== ""
  ) {
    displayMessage(
      "Minimum price cannot be greater than maximum price.",
      "error"
    );
    return;
  }

  fetchSweets(`/search?${params.toString()}`);
});

clearSearchBtn.addEventListener("click", () => {
  clearSearchForm();
  fetchSweets(); // Fetch all sweets again
  displaySearchMessage("Search filters cleared.", "info");
});

// Update Sweet Form
updateSweetForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = updateIdInput.value;
  const updatedSweet = {
    name: updateNameInput.value.trim(),
    category: updateCategoryInput.value.trim(),
    price: parseFloat(updatePriceInput.value),
    quantity: parseInt(updateQuantityInput.value),
  };
  updateSweet(id, updatedSweet);
});

cancelUpdateBtn.addEventListener("click", hideUpdateForm);

// --- Initial Load ---
document.addEventListener("DOMContentLoaded", () => {
  fetchSweets(); // Load all sweets when the page loads
  attachSweetListListeners(); // Attach the single event listener to the table body
});
