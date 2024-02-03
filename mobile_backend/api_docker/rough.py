import cv2
import numpy as np

# Assuming you have a NumPy array representing an image
# Example NumPy array with a 3x3 image (grayscale)
image_array = np.array([[100, 150, 200],
                        [50, 75, 100],
                        [25, 30, 40]], dtype=np.uint8)

# Convert the NumPy array to a cv2 image
cv2_image = cv2.cvtColor(image_array, cv2.COLOR_GRAY2BGR)

# Display the cv2 image (optional)
cv2.imshow("Converted Image", cv2_image)
cv2.waitKey(0)
cv2.destroyAllWindows()
