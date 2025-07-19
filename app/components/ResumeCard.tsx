import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import type { Resume } from "../../types";

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedback, imagePath },
}: {
  resume: Resume;
}) => {
  const { fs } = usePuterStore();
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    const loadImage = async () => {
      if (!imagePath) return;
      
      try {
        const imageBlob = await fs.read(imagePath);
        if (imageBlob) {
          const url = URL.createObjectURL(imageBlob);
          setImageUrl(url);
        }
      } catch (error) {
        console.error("Failed to load image:", error);
      }
    };

    loadImage();

    // Cleanup function to revoke the object URL
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imagePath, fs]);

  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card animate-in fade-in duration-1000"
    >
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          <h2 className="!text-black font-bold break-words">{companyName}</h2>
          <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>
        </div>
        <div className="flex-shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>
      {imagePath && (
        <div className="gradient-border animate-in fade-in duration-1000">
          <div className="w-full h-full">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="resume"
                className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
              />
            ) : (
              <div className="w-full h-[350px] max-sm:h-[200px] bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Loading...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </Link>
  );
};

export default ResumeCard;
