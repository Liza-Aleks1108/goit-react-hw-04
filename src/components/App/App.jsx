import { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "../SearchBar/SearchBar";
import ImageGallery from "../ImageGallery/ImageGallery";
import ImageModal from "../ImageModal/ImageModal";
import LoadMoreBtn from "../LoadMoreBtn/LoadMoreBtn";
import { Audio } from "react-loader-spinner";

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
    return response.data;
  } catch (error) {
    return { results: [], total_pages: 0 };
  }
};

function App() {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getImages = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const data = await fetchImages(query, page);
        setImages((prevImages) => [...prevImages, ...data.results]);
        setTotalPages(data.total_pages);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    };

    getImages();
  }, [query, page]);

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    setImages([]);
    setPage(1);
    setError(null);
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
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
      <SearchBar onSubmit={handleSearch} />
      {loading && page === 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Audio height="80" width="80" radius="9" color="black" />
        </div>
      )}
      {error && <p>Oops... Something went wrong. Error: {error.message}</p>}
      {!loading && images.length === 0 && query && <p>No images found.</p>}
      {images.length > 0 && (
        <>
          <ImageGallery images={images} openModal={openModal} />
          {page < totalPages && (
            <div style={{ textAlign: "center" }}>
              <LoadMoreBtn onClick={handleLoadMore} />
            </div>
          )}
        </>
      )}
      {loading && page > 1 && (
        <Audio height="80" width="80" radius="9" color="green" />
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
