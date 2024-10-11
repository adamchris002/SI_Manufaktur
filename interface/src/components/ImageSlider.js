// import React from "react";

// const ImageSlider = ({ documents }) => {
//   let currentIndex = 0;

//   const handleChangeImageDisplay = () => {
//     if (currentIndex >= documents?.length) {
//       currentIndex = 0;
//     }

//     const currentDocument = documents[currentIndex];
//     if (currentDocument) {
//       const currentImageFilename = currentDocument.filename;
//       const currentImageUrl = `http://localhost:5000/uploads/${currentImageFilename}`;

//       return (
//         <div key={currentIndex}>
//           <img
//             src={currentImageUrl}
//             alt={currentImageFilename} // Use the image filename for alt attribute
//             style={{
//               objectFit: "cover",
//               height: "125px",
//               width: "100%",
//               borderRadius: "20px",
//             }}
//           />
//         </div>
//       );
//     }

//     // Increment index and schedule the next image display after 10 seconds
//     setTimeout(() => {
//       currentIndex++;
//       handleChangeImageDisplay();
//     }, 10000);

//     return null; // Return null initially until the first image is displayed
//   };

//   return <div>{handleChangeImageDisplay()}</div>; // Start image cycling from the first document
// };

// export default ImageSlider;
