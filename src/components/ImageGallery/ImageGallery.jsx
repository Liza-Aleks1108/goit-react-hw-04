import { useState, useEffect } from "react";
import ImageCard from "../ImageCard/ImageCard";
import LoadMoreBtn from "../LoadMoreBtn/LoadMoreBtn";
import { Audio } from "react-loader-spinner";
import { fetchImages } from "../App/App";
import css from "./ImageGallery.module.css"; // Импорт стилей

function ImageGallery({ query, openModal }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const getImages = async () => {
      console.log("Fetching images for query:", query, "page:", page);
      if (!query) return;

      setLoading(true);
      try {
        const data = await fetchImages(query, page);
        console.log("Fetched data:", data);
        setImages((prevImages) => [...prevImages, ...data.results]);
        setTotalPages(data.total_pages);
      } catch (err) {
        console.error("Error fetching images:", err);
        setError(err);
      }
      setLoading(false);
    };

    getImages();
  }, [query, page]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  if (loading && page === 1) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Audio
          height="80"
          width="80"
          radius="9"
          color="black"
          ariaLabel="three-dots-loading"
        />
      </div>
    );
  }

  if (error) {
    return (
      <p>
        Oops... Sorry, something went wrong. Try again. Error: {error.message}
      </p>
    );
  }

  if (images.length === 0 && !loading) {
    return <p>No images found.</p>;
  }

  return (
    <>
      <ul className={css.gallery}>
        {images.map((image) => (
          <li key={image.id} className={css.imageCard}>
            <ImageCard
              src={image.urls.small}
              alt={image.alt_description || "Image"}
              onClick={() => openModal(image)}
            />
          </li>
        ))}
      </ul>
      {page < totalPages && !loading && (
        <div className={css.loadMoreContainer}>
          <LoadMoreBtn onClick={handleLoadMore} />
        </div>
      )}
      {loading && page > 1 && (
        <Audio
          height="80"
          width="80"
          radius="9"
          color="green"
          ariaLabel="three-dots-loading"
          wrapperStyle
          wrapperClass
        />
      )}
    </>
  );
}

export default ImageGallery;
