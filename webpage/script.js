let plates = [];
let videoSocket;
let plateSocket; // Declare plateSocket here

function showPlatesModal() {
    const platesList = document.getElementById("plates-list");
    platesList.innerHTML = "";

    plates.forEach(plate => {
        let li = document.createElement("li");
        li.textContent = plate;
        platesList.appendChild(li);
    });

    const modal = document.getElementById("platesModal");
    modal.style.display = "block";
}

function addPlate() {
    let newPlate = prompt("Enter the new plate number:");
    if (newPlate !== null && newPlate.trim() !== "") { // Check for null and empty input
        newPlate = newPlate.toUpperCase(); // Convert to uppercase after the null check
        plates.push(newPlate);
        alert(`Plate ${newPlate} added.`);
        
        // Send message to the WebSocket
        if (plateSocket) {
            plateSocket.send(`add_${newPlate}`);
        }

        showPlatesModal();
    } else {
        alert("No plate number entered."); // Alert if the user cancels or enters nothing
    }
}

function deletePlate() {
    let plateToDelete = prompt("Enter the plate number to delete:");
    if (plateToDelete !== null && plateToDelete.trim() !== "") { // Check for null and empty input
        plateToDelete = plateToDelete.toUpperCase(); // Convert to uppercase after the null check
        const index = plates.indexOf(plateToDelete);
        if (index > -1) {
            plates.splice(index, 1);
            alert(`Plate ${plateToDelete} deleted.`);
            
            // Send message to the WebSocket
            if (plateSocket) {
                plateSocket.send(`delete_${plateToDelete}`);
            }

            showPlatesModal();
        } else {
            alert(`Plate ${plateToDelete} not found.`);
        }
    } else {
        alert("No plate number entered."); // Alert if the user cancels or enters nothing
    }
}

function connectPlateSocket() {
    if (!plateSocket) {
        plateSocket = new WebSocket(`ws://${Ip_Dir}:${WEBSOCKET_PORT}`); // Use the IP and port of the WebSocket server

        plateSocket.onopen = function() {
            console.log("Connected to plate WebSocket");
        };

        plateSocket.onmessage = function(event) {
            console.log("Message from server:", event.data);
        };

        plateSocket.onclose = function() {
            console.log("Plate WebSocket connection closed");
            plateSocket = null; // Reset WebSocket when closed
        };

        plateSocket.onerror = function(error) {
            console.error("WebSocket error:", error);
        };
    }
}

// Function to show the video feed modal and establish WebSocket connection
function showVideoModal() {
    const videoModal = document.getElementById("videoModal");
    videoModal.style.display = "block";

    const videoElement = document.getElementById("videoFeed");

    // Open WebSocket connection to stream video
    if (!videoSocket) {
        videoSocket = new WebSocket("ws://raspguill.local:8765"); // Replace with your actual WebSocket server

        videoSocket.onmessage = function (event) {
            // Get the base64-encoded image frame
            const base64Image = event.data;
            
            // Update the img element with the new frame
            videoElement.src = 'data:image/jpeg;base64,' + base64Image;
        };

        videoSocket.onclose = function () {
            videoSocket = null; // Reset WebSocket when closed
        };
    }
}

// Event listeners for the buttons
document.getElementById("view-plates").onclick = showPlatesModal;
document.getElementById("add-plate").onclick = addPlate;
document.getElementById("delete-plate").onclick = deletePlate;
document.getElementById("view-video").onclick = showVideoModal;

// Close modals
document.querySelector(".close").onclick = () => {
    document.getElementById("platesModal").style.display = "none";
};

document.querySelector(".close-video").onclick = () => {
    document.getElementById("videoModal").style.display = "none";
    if (videoSocket) {
        videoSocket.close();
        videoSocket = null; // Close the WebSocket when modal is closed
    }
};
