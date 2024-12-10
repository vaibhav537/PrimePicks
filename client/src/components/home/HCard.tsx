import Image from "next/image";
import { FaCaretRight } from "react-icons/fa";

const HomeCards = () => {
  return (
    <div className="h-auto bg-orange-500 flex flex-col lg:flex-row items-center justify-between px-8 lg:px-32 py-10 gap-6 lg:gap-12 text-white">
      {/* Title Section */}
      <div className="text-2xl lg:text-4xl capitalize text-center lg:text-left">
        Gift Cards
      </div>

      {/* Description Section */}
      <div className="text-center lg:text-left">
        <div className="text-lg lg:text-2xl font-semibold">
          Let them choose the perfect gift
        </div>
        <div className="flex items-center gap-2 cursor-pointer justify-center lg:justify-start mt-4">
          <span className="font-semibold underline">Shop Now</span>
          <FaCaretRight size={18} />
        </div>
      </div>

      {/* Image Section */}
      <div className="relative w-48 h-48 lg:w-64 lg:h-64">
        <div className="absolute inset-0 bg-white rounded-lg shadow-lg z-10">
          <Image
            src="/home/GiftCard.png"
            alt="gift card"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default HomeCards;
