import numpy as np
import cv2
from ultralytics import YOLO
import easyocr

final_project = YOLO("best8.pt", task='detect')
reader = easyocr.Reader(['en'])
cap = cv2.VideoCapture('traffic_vid.mp4')

def extract_rois(results, target_label="Placa"):
    rois = []
    coordinates = []
    for result in results:
        for box in result.boxes:
            if final_project.names[int(box.cls)] == target_label:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                roi = result.orig_img[y1:y2, x1:x2]
                rois.append(cv2.cvtColor(roi, cv2.COLOR_BGR2RGB))
                coordinates.append([x1, y1, x2, y2])
    return rois, coordinates

def display_results(frame, results):
    for result in results:
        for box in result.boxes:
            if final_project.names[int(box.cls)] == "Auto":
                car_box = list(map(int, box.xyxy[0]))
                color = (0, 255, 0)
                text = "Car"
                x1, y1, x2, y2 = car_box
                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                cv2.putText(frame, text, (x1, y2 + 30), cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2, cv2.LINE_AA)
    return frame

def annotate_plates(frame, plates, coords):
    for roi, coord in zip(plates, coords):
        x1, y1, x2, y2 = coord
        results = reader.readtext(roi)
        if results:
            text = results[0][1]
        else:
            text = "Can't extract text"
        cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 0, 0), 2)
        cv2.putText(frame, text, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2, cv2.LINE_AA)


frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
fps = int(cap.get(cv2.CAP_PROP_FPS))

out = cv2.VideoWriter('output.mp4', cv2.VideoWriter_fourcc(*'mp4v'), fps, (frame_width, frame_height))

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        print("Can't receive frame (stream end?). Exiting ...")
        break

    results = final_project(frame)
    frame = display_results(frame, results)
    plate_rois, plate_coords = extract_rois(results, target_label="Placa")
    annotate_plates(frame, plate_rois, plate_coords)
    out.write(frame)

    cv2.imshow('frame', frame)
    if cv2.waitKey(1) == ord('q'):
        break

cap.release()
out.release()
cv2.destroyAllWindows()
