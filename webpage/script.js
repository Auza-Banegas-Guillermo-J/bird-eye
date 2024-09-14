let plates = [];

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
    let newPlate = prompt("Enter the new plate number:").toUpperCase();;
    if (newPlate) {
        plates.push(newPlate);
        alert(`Plate ${newPlate} added.`);
        showPlatesModal();
    }
}

function deletePlate() {
    let plateToDelete = prompt("Enter the plate number to delete:").toUpperCase();;
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

// Event listeners
document.getElementById("view-plates").onclick = showPlatesModal;
document.getElementById("add-plate").onclick = addPlate;
document.getElementById("delete-plate").onclick = deletePlate;
document.querySelector(".close").onclick = () => {
    document.getElementById("platesModal").style.display = "none";
};
