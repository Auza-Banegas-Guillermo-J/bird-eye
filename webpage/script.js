let plates = [];
let videoSocket;

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
    let newPlate = prompt("Enter the new plate number:").toUpperCase();
    if (newPlate) {
        plates.push(newPlate);
        alert(`Plate ${newPlate} added.`);
        showPlatesModal();
    }
}

function deletePlate() {
    let plateToDelete = prompt("Enter the plate number to delete:").toUpperCase();
    if (plateToDelete) {
        const index = plates.indexOf(plateToDelete);
        if (index > -1) {
            plates.splice(index, 1);
            alert(`Plate ${plateToDelete} deleted.`);
            showPlatesModal();
        } else {
            alert(`Plate ${plateToDelete} not found.`);
        }
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

// Event listener for the video button
document.getElementById("view-video").onclick = showVideoModal;

// Close video modal and stop the WebSocket
document.querySelector(".close-video").onclick = () => {
    document.getElementById("videoModal").style.display = "none";
    if (videoSocket) {
        videoSocket.close();
        videoSocket = null; // Close the WebSocket when modal is closed
    }
};


// Event listener for the video button
document.getElementById("view-video").onclick = showVideoModal;

// Close video modal and stop the WebSocket
document.querySelector(".close-video").onclick = () => {
    document.getElementById("videoModal").style.display = "none";
    if (videoSocket) {
        videoSocket.close();
        videoSocket = null; // Close the WebSocket when modal is closed
    }
};


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
