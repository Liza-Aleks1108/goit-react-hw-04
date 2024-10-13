import { useState } from "react";
import axios from "axios";
import SearchBar from "../SearchBar/SearchBar";
import ImageGallery from "../ImageGallery/ImageGallery";
import ImageModal from "../ImageModal/ImageModal";
// import css from "./App.module.css";

// Unsplash API
const ACCESS_KEY = "oRnvDff_v4Fguye2gfRmfu2bAV1azLMWGiVWxPK_ofo";
const BASE_URL = "https://api.unsplash.com/search/photos";

export const fetchImages = async (query, page = 1, perPage = 12) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        query,
        page,
        per_page: perPage,
        client_id: ACCESS_KEY,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    return { results: [], total_pages: 0 };
  }
};

function App() {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    setImages([]);
    setPage(1);
  };

  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <>
      <SearchBar onSubmit={handleSearch} />{" "}
      {query && (
        <ImageGallery
          query={query}
          openModal={openModal}
          images={images}
          setImages={setImages}
          setPage={setPage}
        />
      )}
      {selectedImage && (
        <ImageModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          image={selectedImage}
        />
      )}
    </>
  );
}

export default App;
