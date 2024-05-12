"use client";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

const ProductDetailsCrousel = ({ data }) => {
  return (
    <div className="max-w-xl overflow-hidden rounded-lg">
      <Carousel
        infiniteLoop={true}
        thumbWidth={60}
        showIndicators={false}
        showStatus={false}
        className="productCarousel"
      >
        {/* {images?.map((img) => (
          <img
            key={img?.id}
            src={img?.attributes?.url}
            alt={img?.attributes?.name}
          />
        ))} */}
        <img
          className="h-full w-full max-w-full object-cover"
          src={data?.imageUrl}
          alt="product details"
        />
        <img
          className="h-full w-full max-w-full object-cover"
          src={data?.imageUrl}
          alt="product details"
        />

        <img
          className="h-full w-full max-w-full object-cover"
          src={data?.imageUrl}
          alt="product details"
        />
      </Carousel>
    </div>
  );
};

export default ProductDetailsCrousel;
