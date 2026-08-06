import { FaMapMarkerAlt } from "react-icons/fa";
import ClassInfoCard from "./ClassInfoCard";

const CurrentClassCard = ({ currentClass }) => {
  return (
    <ClassInfoCard
      title={<span className="flex items-center gap-2"><FaMapMarkerAlt /> Current Class</span>}
      status="LIVE NOW"
      gradient="indigo"
      item={currentClass}
    />
  );
};

export default CurrentClassCard;