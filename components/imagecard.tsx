// components/ImageCard.tsx
import Image from "next/image";
import { DownloadIcon } from "lucide-react";

interface ImageCardProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

export const ImageCard = ({
  src,
  alt = "Generated Image",
  width = 300,
  height = 300,
}: ImageCardProps) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = src;
    link.download = "generated-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative group bg-white/10 p-3 rounded-lg shadow-lg border border-white/10 max-w-full w-fit">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="rounded-lg max-w-full object-cover"
      />

      <button
        onClick={handleDownload}
        className="mt-2 mr-2 absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
        title="Download Image"
      >
        <DownloadIcon className=" w-5 h-5" />
      </button>
    </div>
  );
};
